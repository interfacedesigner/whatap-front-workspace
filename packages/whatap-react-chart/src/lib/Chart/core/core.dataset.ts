import { formatRgb } from '../helper/helper.color';
import { HitmapHelper } from '../helper/helper.hitmap';
import { setDayStime } from '../helper/helper.lineChart';
import { checkNumber } from '../helper/helper.value';
import { BarChartDataStore } from '../interfaces/BarChartInterface';
import { ChartType } from '../interfaces/BaseInterface';
import { HitmapConfigAttribute } from '../interfaces/ConfigInterface';
import { HitmapDataStore, HitmapDataset, HitmapStr } from '../interfaces/HitmapInterface';
import { DAY_IN_MILLIS } from '../meta/plotMeta';
import { hitmapDataVerifier } from '../util/hitmapUtils';
import mixin from '../util/mixinBuilder';

export const DatasetCore = (Base: any) =>
  class extends mixin(Base).extend(HitmapHelper) {
    public chartType: ChartType;
    public config: HitmapConfigAttribute;
    public data: HitmapDataStore[] | BarChartDataStore[];
    public startTime: number;
    public endTime: number;
    private dataIndex: any = {};
    public dataMaxValue: number;

    public loadChartData(dataset: any) {
      const chartType = this.chartType;

      if (!dataset) {
        dataset = [];
      }

      switch (chartType) {
        case 'HitmapChart':
          this.applyHitmapDataset(dataset);
          break;
        case 'LineChart':
          try {
            this.applySeriesChartDataset(dataset);
          } catch (e) {
            console.log('LineChartV2 load data error');
            console.log(e);
          }
          break;
        case 'HorizontalBarChart':
          this.BarChartDataset(dataset);
          break;
        case 'EqualizerChart':
          this.BarChartDataset(dataset);
          break;
        case 'ArcChart':
        case 'BarChart':
        default:
          break;
      }

      this.config.meta = {
        isDataLoaded: true,
      };
    }

    public updateChartData(dataset: any) {
      const chartType = this.chartType;

      try {
        switch (chartType) {
          case 'HitmapChart':
            this.updateHitmapDataset(dataset);
          case 'LineChart':
          default:
            this.updateSeriesChartDataset(dataset);
            break;
        }
      } catch (e) {
        console.log('Whatap Chart data update err');
        console.log(e);
      }
    }

    private getNewHitmapDataset = (dataset: HitmapDataset) => {
      const newDataMap: Record<number, HitmapDataStore> = {};
      [HitmapStr.HIT, HitmapStr.ERR].map((type, idx) => {
        dataset[type].map((ds) => {
          const time = ds[0];
          if (!newDataMap[time]) {
            newDataMap[time] = [time, [], []];
          }
          const newData = newDataMap[time];
          newData[idx + 1] = ds[1];
        });
      });
      const newDataArr = Object.values(newDataMap);

      return newDataArr;
    };

    private updateHitmapDataset = (dataset?: HitmapDataset) => {
      if (!hitmapDataVerifier(dataset)) {
        return;
      }
      const config = this.config;
      const that = this;

      if (config.hitmap.isStatic) {
        that.data = [];
      }

      const existingDataMap = new Map<number, number>();
      (this.data as Array<HitmapDataStore>).forEach((datum, index) => {
        existingDataMap.set(datum[0], index);
      });

      const newDataMap: Record<number, HitmapDataStore> = {};

      [HitmapStr.HIT, HitmapStr.ERR].forEach((type, idx) => {
        dataset[type].forEach((ds) => {
          const [time, value] = ds;

          const existingIndex = existingDataMap.get(time);
          if (existingIndex === undefined) {
            // 새로운 데이터 준비
            if (!newDataMap[time]) {
              newDataMap[time] = [time, [], []];
            }
            newDataMap[time][idx + 1] = value;
          } else {
            // 기존 데이터 업데이트
            (this.data as Array<HitmapDataStore>)[existingIndex][idx + 1] = value;
          }
        });
      });

      const newDataArr = Object.values(newDataMap);
      (this.data as Array<HitmapDataStore>).push(...newDataArr);

      if (newDataArr.length > 0) {
        this.heapSort.sort(this.data, false, 0);
      }
    };

    private applyHitmapDataset = (dataset?: HitmapDataset) => {
      if (!hitmapDataVerifier(dataset)) {
        return;
      }

      const newDataArr = this.getNewHitmapDataset(dataset);
      this.data = newDataArr;
      this.heapSort.sort(this.data, false, 0);
    };

    // 데이터 초기화
    private applySeriesChartDataset = (dataset: any) => {
      if (!Array.isArray(dataset)) {
        this.setDefaultTimezone();
        return;
      }

      this.data = [];
      this.dataIndex = {};
      this.dataMaxValue = 0;

      const [stime, etime] = this.lineChartDataSetConverter(dataset);
      this.settingTime(stime, etime, false);
      this.setDataTheme();
      if (this.config.common.stack) {
        this.setStackValue();
      }
    };

    private updateSeriesChartDataset = (dataset: any) => {
      if (!Array.isArray(dataset)) {
        return;
      }

      const [stime, etime] = this.lineChartDataUpdateConverter(dataset);
      this.setDataTheme();
      if (this.config.common.stack) {
        this.setStackValue();
      }
      this.settingTime(stime, etime, true);
    };

    private updateLineChartDataset = (dataset: any) => {
      if (!Array.isArray(dataset)) {
        return;
      }

      let dataEndTime = this.endTime;
      dataset.map((ds: any, idx: number) => {
        if (typeof ds !== 'undefined') {
          if (!Array.isArray(ds.data) || !ds.data[0]) {
            return;
          }

          if (typeof this.dataIndex[ds.key] !== 'undefined') {
            const thisData = this.data[this.dataIndex[ds.key]] as any;

            ds.data.map((d: any) => {
              if (!Array.isArray(d) || !d[0]) {
                // 잘못된 형식의 데이터의 경우 무시
                return;
              }

              if (thisData.maxValue < d[1]) {
                thisData.maxValue = d[1];
                if (this.dataMaxValue < d[1]) {
                  this.dataMaxValue = d[1];
                }
              }

              if (dataEndTime < d[0]) {
                //최근 시간 데이터가 들어오면 푸시
                dataEndTime = d[0];
                thisData.data.push(d);
              } else {
                const dataLength = thisData.data.length - 1;
                if (dataLength < 0) {
                  // 기존에 데이터가 없는 경우에도 푸시
                  dataEndTime = d[0];
                  thisData.data.push(d);
                } else {
                  for (let i = dataLength; i >= 0; i--) {
                    const thisDt = thisData.data[i];
                    const time = thisDt[0];

                    if (time > d[0]) {
                      continue;
                    }

                    if (time === d[0]) {
                      // 같은 시간 데이터가 들어오면 덮어쓰기
                      thisDt[1] = d[1];
                      break;
                    }

                    if (time < d[0]) {
                      // 없던 시간 데이터가 없으면 끼워넣기
                      thisData.data.splice(i, 0, d);
                      break;
                    }
                  }
                }
              }
            });
            this.heapSort.sort(thisData.data);
          } else {
            this.heapSort.sort(ds.data);
            const colorValue = this.palette.getColorFromId(ds.id);
            const strokeValue = formatRgb(colorValue.rgb);
            const fillValue = formatRgb(colorValue.rgb, 0.7);
            const dataLength = ds.data.length;
            let dataMaxValue = 0;

            const lastData = ds.data[dataLength - 1];
            if (lastData[0] > dataEndTime) {
              dataEndTime = lastData[0];
            }

            ds.data.map((d, i) => {
              const time = d[0];
              const value = d[1];

              if (value > dataMaxValue) {
                dataMaxValue = value;
              }
            });

            if (this.dataMaxValue < dataMaxValue) {
              this.dataMaxValue = dataMaxValue;
            }

            this.dataIndex[ds.key] =
              this.data.push({
                key: ds.key,
                id: ds.id,
                label: ds.label,
                data: ds.data,
                rowData: ds,
                maxValue: dataMaxValue,
              }) - 1;
          }
        }
      });

      if (this.config.xAxis.dayDiff) {
        setDayStime(this.data);
      }
      this.settingTime(undefined, dataEndTime, true);
      this.setDataTheme();
    };

    public settingTime = (stime: number = this.startTime, etime: number = this.endTime, update?: boolean) => {
      const { xAxis, common } = this.config;
      let updateAnimation = this.config.common.updateAnimation;
      updateAnimation = false;

      // update true = data update, false = data set, undefined = option set
      if (updateAnimation && this.data.length >= 20) {
        updateAnimation = false;
      }

      if (updateAnimation && this.endTime - this.startTime < etime - this.endTime) {
        updateAnimation = false;
      }

      if (common.postRender) {
        this.startTime = common.postRender.startTime;
        this.endTime = common.postRender.endTime;
        if (update) {
          this.deleteData();
        }
        return;
      }

      if (xAxis.dayDiff || xAxis.dayDiffMulti) {
        const date = this.chartSub.dayStime ? new Date(this.chartSub.dayStime) : new Date();
        date.setHours(0, 0, 0, 0);
        this.startTime = date.getTime();
        this.endTime = date.getTime() + DAY_IN_MILLIS;
        this.deleteData();
        return;
      }

      if (updateAnimation && typeof update === 'undefined') {
        return;
      }

      if (xAxis.liveTime) {
        // 실시간 시간 고정
        etime = Date.now();
      }

      if (xAxis.timeDiff) {
        stime = etime - xAxis.timeDiff;
      }

      if (updateAnimation && update) {
        this.updateAnimation(stime, etime);
      } else {
        this.startTime = stime;
        this.endTime = etime;
        if (update) {
          this.deleteData();
        }
      }
    };

    public deleteData = () => {
      const data = this.data as any;
      const { xAxis } = this.config;
      if (xAxis.dayDiff || xAxis.dayDiffMulti) {
        this.deleteDayDiffData();
        return;
      }

      const dataLength = data.length;
      for (let i = 0; i < dataLength; i++) {
        const ds = data[i];
        let deleteCount = 0;
        const seriesDataLength = ds.data.length;
        if (ds.dataStartTime < this.startTime) {
          for (let j = 0; j < seriesDataLength; j++) {
            const d = ds.data[j];
            const [time] = d;

            // 시작 시간 이상의 데이터는 지우지 않음.
            if (time >= this.startTime) {
              // 순회중인 데이터의 시간이 차트의 시작 시간 이상이 된 경우 순회를 멈추고 해당 시간을 데이터의 시작 시간으로 지정
              ds.dataStartTime = time;
              break;
            } else {
              ++deleteCount;
              if (ds.maxValueData && d === ds.maxValueData) {
                if (ds.maxValueData === this.dataMaxValueData) {
                  this.dataMaxValue = 0;
                  this.dataMaxValueData = undefined;
                }
                ds.maxValue = 0;
                ds.maxValueData = undefined;
              }
            }
          }
        }

        // 최근 x분을 보여주는 경우에는 한칸을 덜 삭제한다(그렇지 않으면 차트의 시작시간이 짤려 보일 수 있다.)
        // 삭제하려는 데이터의 수와 데이터의 총 개수가 같으면 그냥 다 지운다
        if (xAxis.timeDiff && deleteCount && deleteCount !== seriesDataLength) {
          --deleteCount;
        }

        if (deleteCount) {
          ds.data.splice(0, deleteCount);
        }
        // maxValue가 지워진 경우 새로운 값으로 갱신
        if (!ds.maxValueData) {
          ds.data.forEach((d: any) => {
            const value = d[1];
            if (checkNumber(value) && value > ds.maxValue) {
              ds.maxValue = value;
              ds.maxValueData = d;
            }
          });
        }
      }

      if (!this.dataMaxValueData) {
        this.updateMaxValue();
      }
    };

    private deleteDayDiffData = () => {
      this.data.map((datas) => {
        const data = datas.data;
        const len = data.length;
        let i = -1;
        while (i < len && data[++i][0] < datas.dayStime);
        data.splice(0, i);
      });
    };

    private BarChartDataset = (dataset: any) => {
      this.data = [];
      let maxValue = 0;
      dataset.map((ds, idx) => {
        let total = 0;
        let data = [];
        if (ds.data) {
          ds.data.map((d, i) => {
            if (checkNumber(d.data)) {
              data.push({ ...d });
              total += typeof d.data === 'number' ? d.data : 0;
            }
          });
        }
        const newData: BarChartDataStore = {
          ...ds,
          data,
          total,
        };

        if (total > maxValue) {
          maxValue = total;
        }
        this.data.push(newData);
      });

      if (this.config.yAxis.sort) {
        this.data = this.data.sort((a, b) => this.config.yAxis.sort(a.total, b.total));
      }
      this.dataMaxValue = maxValue;
    };
  };
