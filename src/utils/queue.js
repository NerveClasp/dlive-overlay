class Queue {
  head = null;
  tail = null;
  size = -1;

  add(data) {
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
    return this.head;
  }
}

export default Queue;
