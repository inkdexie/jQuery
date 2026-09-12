const state = { data: null };

const setStatus = (text, type) => {
  $('#status').text(text).attr('class', 'alert alert-' + type).show();
};

const renderCards = (data) => {
  $('#cards').empty();
  data.series.forEach(s => {
    const avgTemp = Math.round(s.temps.reduce((sum, n) => sum + n, 0) / s.temps.length);
    const totalRain = s.rain.reduce((sum, n) => sum + n, 0);
    $('#cards').append(`
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${s.city}</h3>
            <p class="card-text fs-4">${avgTemp}℃ / ${totalRain}mm</p>
            <p class="card-text small text-muted">年均温 / 全年累计降水</p>
          </div>
        </div>
      </div>
    `);
  });
};

const loadData = async () => {
  setStatus('加载中...', 'warning');
  try {
    const response = await fetch('data/weather.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (!data.series || data.series.length === 0) {
      setStatus('暂无数据', 'warning');
      return;
    }
    state.data = data;
    $('#sub-title').text(data.title);
    $('#data-source').text('数据来源：' + data.source + ' · 气温单位：℃ · 降水量单位：mm');
    $('#status').hide();
    renderCards(data);
    renderTempChart(data);
    renderRainChart(data);
  } catch (error) {
    setStatus('加载失败：' + error.message, 'danger');
  }
};

let tempChart = null;

const renderTempChart = (data) => {
  if (tempChart === null) {
    tempChart = echarts.init(document.querySelector('#temp-chart'));
  }
  tempChart.setOption({
    title: { text: '各城市月均气温（℃）', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 20, top: 50, bottom: 50 },
    xAxis: { type: 'category', data: data.months },
    yAxis: { type: 'value', name: '℃' },
    series: data.series.map(s => ({
      name: s.city,
      type: 'line',
      data: s.temps
    }))
  });
};

let rainChart = null;

const renderRainChart = (data) => {
  if (rainChart !== null) {
    rainChart.destroy();
  }
  const ctx = document.querySelector('#rain-chart');
  rainChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.months,
      datasets: data.series.map(s => ({
        label: s.city,
        data: s.rain,
        borderWidth: 1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '各城市月降水量（mm）' }
      },
      scales: {
        y: { title: { display: true, text: 'mm' } }
      }
    }
  });
};

window.addEventListener('resize', () => {
  if (tempChart) tempChart.resize();
});

loadData();
