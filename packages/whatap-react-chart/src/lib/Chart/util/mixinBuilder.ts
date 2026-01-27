/**
 * MixinBuilder
 * https://blog.seotory.com/post/2017/08/javascript-es6-use-class-and-mixin
 * Creates a Superclass out of multiple mixin components.
 * Used for enhancing component reusability.
 * Call `extend` from the class to form a superclass
 * out of multiple mixin components.
 */
class MixinBuilder {
  private superclass: any;

  constructor(superclass: any) {
    this.superclass = superclass;
  }

  extend(...mixins: any[]) {
    return mixins.reduce((acc, mixin) => {
      return mixin(acc);
    }, this.superclass);
  }
}

export default (superclass: any) => new MixinBuilder(superclass);
