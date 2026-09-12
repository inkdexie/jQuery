const state = { data: null };

const setStatus = (text, type) => {
  $('#status').text(text).attr('class', 'alert alert-' + type).show();
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
  } catch (error) {
    setStatus('加载失败：' + error.message, 'danger');
  }
};

loadData();
