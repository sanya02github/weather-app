import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Paper, Typography, Box, Grid, CardContent, Card } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { WbSunny, CloudQueue, AirlineSeatIndividualSuite, WbTwilight } from '@mui/icons-material';
import { auth, firestore } from '../../firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
const API_KEY = "806e42f8ea206ff091f7c0abe03bd99c";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [extendedForecast, setExtendedForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('metric');

  useEffect(() => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        error => {
          setError(error);
          setLoading(false);
        }
      );
    } else {
     
      fetchWeatherData();
    }

  const fetchTemperatureUnit = async () => {
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log(userData)
        setTemperatureUnit(userData.temperatureUnit==='fahrenheit' ? 'imperial' : 'metric');
      }
    } catch (error) {
      console.error('Error fetching temperature unit preference:', error);
    }
  };

  fetchTemperatureUnit();
}, [temperatureUnit]);

  const fetchWeatherData = (latitude,longitude) => {
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${temperatureUnit}`)
      .then(response => response.json())
      .then(data => {
        setWeatherData(data);
        fetchHourlyForecast(data.coord.lat, data.coord.lon);
        fetchExtendedForecast(data.coord.lat, data.coord.lon);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  const fetchHourlyForecast = (latitude, longitude) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${temperatureUnit}`)
      .then(response => response.json())
      .then(data => {
        setHourlyForecast(data.list.slice(0, 5));
      })
      .catch(error => {
        console.error('Error fetching hourly forecast:', error);
      });
  };

  const fetchExtendedForecast = (latitude, longitude) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=5&appid=${API_KEY}&units=${temperatureUnit}`)
      .then(response => response.json())
      .then(data => {
        setExtendedForecast(data.list);
      })
      .catch(error => {
        console.error('Error fetching extended forecast:', error);
      });
  };

 
  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=${temperatureUnit}`)
      .then(response => response.json())
      .then(data => {
        setWeatherData(data);
        fetchHourlyForecast(data.coord.lat, data.coord.lon);
        fetchExtendedForecast(data.coord.lat, data.coord.lon);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mt: 2, color: '#ff7f50' }}>
            Loading...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mt: 2, color: '#ff7f50' }}>
            Error: {error.message}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter a city name"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button type="submit" variant="contained" style={{ backgroundColor: "#ff7f50" }} >
       <SearchIcon />
              </Button>
              ),
            }}
          />
        </form>
        {weatherData && (
          <Box mt={2}>
            <Typography variant="h6" sx={{ color: '#ff7f50' }}>
              Current Weather
            </Typography>
            <Box mt={2}>
              <Typography variant="h3" component="span" color="#ff7f50">
              {Math.round(weatherData.main.temp)}°{temperatureUnit === 'metric' ? 'C' : 'F'}

              </Typography>
              <Typography variant="h6" component="span" color="textSecondary">
                {' - '}
                {weatherData.weather[0].description}
              </Typography>
            </Box>
            <Box mt={2}>
                <Typography variant="body1" color="textSecondary">
                  Location: {weatherData.name}
                </Typography>
              </Box>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <WbSunny />
                    <Typography variant="body1" ml={1}>
                      {weatherData.main.humidity}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <CloudQueue />
                    <Typography variant="body1" ml={1}>
                    {weatherData.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <AirlineSeatIndividualSuite />
                    <Typography variant="body1" ml={1}>
                      {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <WbTwilight />
                    <Typography variant="body1" ml={1}>
                      {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mt={2}>
              <Typography variant="h6" sx={{ color: '#ff7f50' }}>
                Hourly Forecast
              </Typography>
              <Grid container spacing={2}>
                {hourlyForecast.slice(0, 5).map((forecast, index) => (
                  <Grid item key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="body1">
                          {new Date(forecast.dt * 1000).toLocaleTimeString()}
                        </Typography>
                        <Typography variant="body1"> {Math.round(forecast.main.temp)}°{temperatureUnit === 'metric' ? 'C' : 'F'}</Typography>
                        <Typography variant="body1">{forecast.weather[0].description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box mt={2}>
              <Typography variant="h6" sx={{ color: '#ff7f50' }}>
                Extended Forecast
              </Typography>
              <Grid container spacing={2}>
                {extendedForecast.slice(1, 6).map((forecast, index) => (
                  <Grid item key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="body1">
                          {new Date(forecast.dt * 1000).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                          {forecast.main.temp_max}°{temperatureUnit === 'metric' ? 'C' : 'F'} / {forecast.main.temp_min}°{temperatureUnit === 'metric' ? 'C' : 'F'}
                        </Typography>
                        <Typography variant="body1">{forecast.weather[0].description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SearchPage;