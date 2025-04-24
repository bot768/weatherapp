const translations = {
    'en': {
       title: 'Weather App',
       placeholder: 'Enter city name',
       searchBtn: 'Search',
       errorMsg: 'please enter a city',
       notFound: 'City not found',
       currentWeather: 'Current Weather',
       hourlyForecast: 'Hourly Forecast',

    },
    zh: {
       title: '天气应用',
       placeholder: '请输入城市名称',
       searchBtn: '搜索',
       errorMsg: '请输入城市名称',
       notFound: '城市未找到',
       currentWeather: '当前天气',
       hourlyForecast: '小时预报'
    }
}
let currentLanguage = 'zh';
 function changeLanguage(language) {
    currentLanguage = language;
    updateUIText();
}
function updateUIText() {
    const langText = translations[currentLanguage];
    document.getElementById('app-title').textContent = langText.title;
    document.getElementById('city').placeholder= langText.placeholder;
    document.getElementById('search-btn').textContent = langText.searchBtn;
}
async function getWeather() {
    const apiKey = 'd2e1741a702fa6f7be95ea9126bd5667';
    const cityInput = document.getElementById('city').value.trim();
    if (!cityInput) {
        alert(translations[currentLanguage].errorMsg);
        return;
    }

try 
{
   let cityName = cityInput;
   if(/[\u4e00-\u9fa5]/.test(cityInput)) {
       cityName = await convertChineseToPinyin(cityInput);
   }
   const[currentData, forecastData] = await Promise.all([

       fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`).then(res=> res.json()),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&cnt=8`)
        .then(res=> res.json())
        
    ]);
        if(currentData.cod === '404') {
           displayError(translations[currentLanguage].notFound);
           return;
        }
        displayWeather(currentData);
        displayHourlyForecast(forecastData.list);

} catch (error) {
    console.error('Error:', error);
    displayError('获取天气信息失败');
}
}
async function convertChineseToPinyin(cityName) {
   const cityMap = {

       '北京': 'beijing',
       '上海': 'shanghai',
       '广州': 'guangzhou',
       '深圳': 'shenzhen',
       '杭州': 'hangzhou',
       '成都': 'chengdu',
       '南京': 'nanjing',
       '武汉': 'wuhan',
       '西安': 'xian',
       '厦门': 'xiamen',
       '苏州': 'suzhou',
       '天津': 'tianjin',
       '重庆': 'chongqing',
       '郑州': 'zhengzhou',
       '沈阳': 'shenyang',
       '济南': 'jinan',
       '昆明': 'kunming',
       '长沙': 'changsha',
       '福州': 'fuzhou',
       '哈尔滨': 'haerbin',
       '合肥': 'hefei',
       '石家庄': 'shijiazhuang',
       '南昌': 'nanchang',
       '贵阳': 'guiyang',
       '南宁': 'nanning',
       '呼和浩特': 'huhehaote',
       '兰州': 'lanzhou',
       '太原': 'taiyuan',
       '西宁': 'xining',
       '银川': 'yinchuan',
       '乌鲁木齐': 'wulumuqi',
       '拉萨': 'lasa',
       '西宁': 'xining',
       '长春': 'changchun',
       '贵阳': 'guiyang',
       '南宁': 'nanning',
       '香港': 'xianggang',
       '澳门': 'aomen',
       '台北': 'taipei',
       '高雄': 'kaohsiung',
       '台北': 'taipei',
       '台中': 'zhongshan',
       '台南': 'tansan',
       "青岛":"qingdao",
       '宁波': 'ningbo',
       '绍兴': 'shaoxing',
       '杭州': 'hangzhou',
       '济宁': 'jining',
       
         }
   return cityMap[cityName] || cityName;
}
updateUIText();


function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;

        const weatherHtml = `<p>${cityName}</p> <p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `<div class="hourly-item"><span>${hour}:00</span><img src="${iconUrl}" alt="Hourly Weather Icon"><span>${temperature}°C</span></div>`;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}