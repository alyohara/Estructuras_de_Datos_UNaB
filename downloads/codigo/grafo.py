class Graph:
    def __init__(self):
        self.vertices = {}

    def add_vertex(self, value):
        if value not in self.vertices:
            self.vertices[value] = []

    def add_edge(self, from_vertex, to_vertex):
        if from_vertex in self.vertices and to_vertex in self.vertices:
            self.vertices[from_vertex].append(to_vertex)
        else:
            raise ValueError("Invalid vertex")

    def display(self):
        for vertex in self.vertices:
            print(f"{vertex} -> ", end="")
            neighbors = self.vertices[vertex]
            if neighbors:
                for neighbor in neighbors:
                    print(f"{neighbor} -> ", end="")
            print("None")

# Example usage
graph = Graph()
graph.add_vertex(1)
graph.add_vertex(2)
graph.add_vertex(3)
graph.add_vertex(4)
graph.add_vertex(5)
graph.add_vertex(6)
graph.add_edge(1, 2)
graph.add_edge(1, 3)
graph.add_edge(2, 4)
graph.add_edge(4, 5)
graph.add_edge(4, 6)
graph.add_edge(5, 6)
graph.display()
