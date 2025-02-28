const PENDING = Symbol();
const REJECTED = Symbol();
const FULLFILLED = Symbol();

const MyPromise = class {
  _timer = null;

  _status = PENDING;
  _value = null;
  _reason = null;

  _fulfiledCallbacks = [];
  _rejectedCallbacks = [];

  constructor(cb) {
    cb(this._onResolve.bind(this), this._onReject.bind(this));
  }

  _helperMethod(statusSymbol, tmp) {
    if ([REJECTED, FULLFILLED].includes(statusSymbol)) {
      this._timer = setTimeout(() => {
        if (statusSymbol === FULLFILLED) {
          this._value = tmp;
          this._fulfiledCallbacks.forEach((cb) => {
            cb(tmp);
          });
          this._fulfiledCallbacks = [];
        } else {
          this._reason = tmp;
          this._rejectedCallbacks.forEach((cb) => {
            cb(tmp);
          });
          this._rejectedCallbacks = [];
        }

        if (this._timer) {
          clearTimeout(this._timer);
        }
      }, 0);
    } else {
      return this._value;
    }
  }

  _onResolve(value) {
    this._helperMethod(FULLFILLED, value);
  }

  _onReject(reason) {
    this._helperMethod(REJECTED, reason);
  }

  then(onResolve, onReject) {
    return new MyPromise((resolve, reject) => {
      const { _status: promiseStatus, _value, _reason } = this;

      if (promiseStatus === FULLFILLED) {
        resolve(onResolve(_value));
        return;
      }

      if (promiseStatus === REJECTED) {
        reject(_reason);
        return;
      }

      this._fulfiledCallbacks.push((v) => {
        resolve(onResolve(v));
      });

      if (onReject) {
        this._rejectedCallbacks.push(onReject);
      }
    });
  }
};

// test
let p = new MyPromise((resolve, reject) => {
  resolve("hello");
});
p.then((res) => {
  console.log(res); // hello
});
