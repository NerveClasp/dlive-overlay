interface INode<T> {
  data: T;
  next: INode<T> | null;
}

interface IQueue<T> {
  add: (data: T) => void;
  get: () => T | null;
  getSize: () => number;
  peak: () => T | null;
}

class Queue<T> implements IQueue<T> {
  head: INode<T> | null = null;
  tail: INode<T> | null = null;
  size: number = -1;

  add(data: T) {
    const node = { data, next: null };

    if (this.head === null) {
      this.head = node;
    } else {
      this.tail.next = node;
    }
    this.tail = node;
    ++this.size;
  }

  get() {
    if (this.head === null) return null;

    const node = this.head;
    this.head = this.head.next;
    this.size--;

    return node.data;
  }

  getSize() {
    return this.size;
  }

  peak() {
    if (!this.head) return null;
    return this.head.data;
  }
}

export default Queue;
