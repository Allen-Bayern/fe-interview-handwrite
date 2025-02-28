export interface EventDict {
  [key: string]: (...args: any) => any;
}

/**
 * @description 简单的发布订阅模式
 */
export class EventRocket<D extends EventDict = EventDict> {
  eventDict: {
    [Key in keyof D]: D[Key][];
  } = Object.create(null);

  //  发布
  publish<Key extends keyof D>(eventName: Key, cb: D[Key]) {
    if (!this.eventDict.hasOwnProperty(eventName)) {
      // 增加发布数组
      Object.assign(this.eventDict, {
        [eventName]: [],
      });
    }

    this.eventDict[eventName].push(cb);

    return this;
  }

  //   订阅
  emit<Key extends keyof D>(eventName: Key, ...args: Parameters<D[Key]>) {
    const emitted = this.eventDict[eventName];

    if (emitted.length) {
      emitted.forEach((cb) => {
        cb(...args);
      });
    }

    return this;
  }

  //  取消发布
  unpublish<Key extends keyof D>(eventName: Key, cb: D[Key]): this {
    const cbIndex = this.eventDict[eventName].indexOf(cb);
    if (cbIndex > -1) {
      this.eventDict[eventName].splice(cbIndex, 1);
    }

    return this;
  }
  //    一次即用
  once<Key extends keyof D>(
    eventName: Key,
    cb: D[Key],
    ...args: Parameters<D[Key]>
  ) {
    // 执行一次的回调函数
    const listener = () => {
      this.unpublish(eventName, cb);
      cb(...args);
    };

    return this.publish(eventName, listener as D[Key]);
  }
}
