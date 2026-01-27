import { addComma } from '../helper/helper.value';

export default {
  type: 'LineChart',
  xAxis: {
    tick: {
      display: true,
      format: false, //x축 포멧, 지정하지 않을 시 차트에서 표현되는 범위에 따라 자동으로 표현
    },
    axisLine: {
      display: true,
    },
    plotLine: {
      display: false,
    },
    verticaLine: false, // [{ time, time2, color }]
    liveTime: false, // 차트의 endtime을 현재 시간으로 고정합니다 (Date.now())
    timeDiff: false,
    dayDiff: false, // 오늘 + 과거 1일 비교할때 사용합니다. 홣성화시 라인은 2개까지 그릴 수 있습니다. (오늘, 과거 1일)
    dayDiffMulti: false, // 특정 날짜 + 특정 날짜 비교할 때 사용, 여러 라인을 그릴 수 있으며 dayDiffMulti 옵션에 기준이 되는 날짜를 넣으면 됩니다.
  },
  yAxis: {
    tick: {
      display: true,
      format: addComma,
    },
    axisLine: {
      display: true,
    },
    plotLine: {
      display: true,
    },
    horizontalLine: false, // [{ value, value2, title, color }] 해당 y 값에 가로 라인 추가
    maxValue: false, //number
    integerOnly: false,
    unitDivider: 1000,
    textPosition: 'default',
  },
  tooltip: {
    selectAll: false,
    label: {
      format: false,
    },
    value: {
      format: addComma,
    },
    time: {
      format: false,
    },
  },
  dot: {
    display: false,
    format: false,
  },
  common: {
    area: false, //Line 아래를 채울지 여부
    stack: false, //Stack 차트 여부
    updateAnimation: true, // 업데이트시 애니메이션 표시 여부
    plotVerticalLine: true, // 마우스 Hover시 해당 세로 라인에 점선 표시
    plotMaxValue: false, // 가장 값이 높은 부분 표시
    plotMaxText: true, // plotMaxValue가 true인 경우 사용. false인 경우 차트 상에 text는 표시하지 않음
    onTimeSelect: false, // 클릭한 부분의 시간값 반환 true를 리턴할시 해당 부분에 레드라인
    dragCallback: false, // 드래그 콜백 함수 ex) (startTime, endTime) => {} (startTime: 드래그 시작 시간 (UTC), endTime: 드래그 끝 시간)
    gradient: true,
    offset: {
      // 차트 오프셋 간격
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
    },
    lineOptions: false, // 특정 데이터 라인의 스타일, visible 등 라인을 컨트롤 할 수 있는 옵션
    postRender: false, // 차트 범위 강제 적용 { startTime: 시작시간 (UTC), endTime: 끝 시간}
    focus: false, // 차트 특정 범위 포커스 이벤트 ( {stime: 시작시간 (number), etime: 끝 시간 }) 포커스 외 부분 어두워짐
  },
};
