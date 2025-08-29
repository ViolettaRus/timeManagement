export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.raw;
          const isHours = context.datasetIndex === 1;
          return `${label}: ${value} ${isHours ? 'ч' : 'сек'}`;
        }
      }
    }
  },
  layout: {
    padding: {
      top: 20,
      bottom: 20
    }
  }
};

export const barOptions = {
  ...chartOptions,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        precision: 0
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};