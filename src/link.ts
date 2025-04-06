interface ListNode<T = unknown> {
  value: T;
  next: ListNode<T> | null;
}

const createEmptyListNode = <T = unknown>(value: T): ListNode<T> => {
  return {
    value,
    next: null,
  };
};

// 递归法
const reverseListNodeRecursion = <T = unknown>(
  ln?: ListNode<T> | null
): ListNode<T> | null => {
  if (!ln || !ln.next) {
    return ln ?? null;
  }

  const newNode = reverseListNodeRecursion(ln.next);
  ln.next.next = ln;
  ln.next = null;

  return newNode;
};

// 头插法
const reverseListNodeHead = <T = unknown>(
  ln?: ListNode<T> | null
): ListNode<T> | null => {
  if (!ln || !ln.next) {
    return ln ?? null;
  }

  const dummy = createEmptyListNode("" as T);
  while (ln) {
    const { next: lnNext } = ln;
    ln.next = dummy.next;
    dummy.next = ln;
    ln = lnNext;
  }

  return dummy.next;
};

// 迭代法
const reverseListNodeIter = <T = unknown>(
  ln?: ListNode<T> | null
): ListNode<T> | null => {
  if (!ln || !ln.next) {
    return ln ?? null;
  }

  let prev: ListNode<T> | null = null;
  let curr: ListNode<T> | null = ln;

  while (curr) {
    const { next: currNext } = curr;
    curr.next = prev;
    prev = curr;
    curr = currNext;
  }

  return prev;
};
