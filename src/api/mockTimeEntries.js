const mockTimeEntries = {
  getAll: async (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let entries = JSON.parse(localStorage.getItem('mockTimeEntries')) || [];
        entries.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        resolve(entries);
      }, 300);
    });
  },
  create: async (entryData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = JSON.parse(localStorage.getItem('mockTimeEntries')) || [];
        const newEntry = {
          ...entryData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        entries.unshift(newEntry);
        localStorage.setItem('mockTimeEntries', JSON.stringify(entries));
        resolve(newEntry);
      }, 300);
    });
  }
};

export default mockTimeEntries;