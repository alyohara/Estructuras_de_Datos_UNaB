class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Queue:
    def __init__(self):
        self.head = None
        self.tail = None

    def is_empty(self):
        return self.head is None

    def enqueue(self, data):
        new_node = Node(data)
        if self.is_empty():
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node

    def dequeue(self):
        if self.is_empty():
            return None
        data = self.head.data
        self.head = self.head.next
        if self.head is None:
            self.tail = None
        return data

    def peek(self):
        if self.is_empty():
            return None
        return self.head.data

    def __str__(self):
        current = self.head
        queue_str = ""
        while current:
            queue_str = str(current.data) + " -> " + queue_str
            current = current.next
        queue_str = "-> " + queue_str
        
        return queue_str.strip()

# Example usage
queue = Queue()
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)

print(queue)            # Output: 1 2 3

print(queue.dequeue())  # Output: 1
print(queue.dequeue())  # Output: 2
print(queue.peek())     # Output: 3