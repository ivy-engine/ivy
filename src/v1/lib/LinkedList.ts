export class LinkedListNode<T> {
  public next: LinkedListNode<T> | null = null;
  public prev: LinkedListNode<T> | null = null;
  public value: T;
  constructor(value: T) {
    this.value = value;
  }

  public remove = () => {
    if (this.prev) {
      this.prev.next = this.next;
    }
    if (this.next) {
      this.next.prev = this.prev;
    }
    this.prev = null;
    this.next = null;
    this.value = null;
    this.length--;
  }
}

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private length: number = 0;

  public push = (value: T): LinkedListNode<T> => {
    const node = new LinkedListNode<T>(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++;
    return node;
  }

  public pop = (): LinkedListNode<T> | null => {
    if (this.length === 0) {
      return null;
    }
    const node = this.tail;
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = node.prev;
      this.tail.next = null;
      node.prev = null;
    }
    this.length--;
    return node;
  }

  public loop = (callback: (node: LinkedListNode<T>) => void) => {
    let node = this.head;
    while (node) {
      callback(node);
      node = node.next;
    }
  }
}