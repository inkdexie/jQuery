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
  } catch (error) {
    setStatus('加载失败：' + error.message, 'danger');
  }
};

loadData();
