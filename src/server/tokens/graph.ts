export class Graph {
  private adjacencyList: Map<string, string[]> = new Map();

  addEdge(source: string, destination: string): void {
    const neighbors = this.adjacencyList.get(source);

    if (neighbors) {
      neighbors.push(destination);
    } else {
      this.adjacencyList.set(source, [destination]);
    }
  }

  shortestPath(source: string, destination: string): null | string[] {
    const visited: Record<string, boolean> = {};
    const previous: Record<string, string> = {};
    const queue = [source];

    while (queue.length) {
      let current = queue.shift() as string;

      if (current === destination) {
        const path = [current];

        while (previous[current]) {
          path.push(previous[current]!);
          current = previous[current]!;
        }

        return path.reverse();
      }

      visited[current] = true;

      const neighbors = this.adjacencyList.get(current);

      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited[neighbor]) {
            queue.push(neighbor);
            previous[neighbor] = current;
          }
        }
      }
    }

    return null;
  }
}
