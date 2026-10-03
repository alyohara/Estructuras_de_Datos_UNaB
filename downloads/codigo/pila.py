class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Stack:
    def __init__(self):
        self.head = None

    def is_empty(self):
        return self.head is None

    def push(self, data):
        new_node = Node(data)
        if self.is_empty():
            self.head = new_node
        else:
            new_node.next = self.head
            self.head = new_node

    def pop(self):
        if self.is_empty():
            return None
        else:
            popped_node = self.head
            self.head = self.head.next
            popped_node.next = None
            return popped_node.data

    def peek(self):
        if self.is_empty():
            return None
        else:
            return self.head.data

    def display(self):
        current = self.head
        stack_values = []
        while current:
            stack_values.append(str(current.data))
            current = current.next
        print("Stack:")
        for value in reversed(stack_values):
            print("|", value, "|")
        print("-------")
        
stack = Stack()
stack.push(5)
stack.push(10)
stack.push(15)
stack.display()