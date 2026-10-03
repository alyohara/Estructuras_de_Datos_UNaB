class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def is_empty(self):
        return self.head is None

    def append(self, data):
        new_node = Node(data)
        if self.is_empty():
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node

    def display(self):
        if self.is_empty():
            print("Linked list is empty")
        else:
            current = self.head
            while current:
                print(f"|{current.data}| -> ", end="")
                current = current.next
            print("None")
            
            
# Example usage of LinkedList class
my_list = LinkedList()

# Append elements to the linked list
my_list.append(10)
my_list.append(70)
my_list.append(30)

# Display the linked list
my_list.display()