import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';
import { Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { WbSunny, CloudQueue, AirlineSeatIndividualSuite, WbTwilight } from '@mui/icons-material';
import { auth, firestore } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export default function Homepage() {
    const [intervalId, setIntervalId] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState('');
    const [temperatureUnit, setTemperatureUnit] = useState('metric');
  
    const notify = (weatherData) => {
        if (weatherData) {
            toast(`${Math.round(weatherData.main.temp)}${temperatureUnit === 'imperial' ? '°F' : '°C'} - ${weatherData.name}`);
        }
        intervalId ? setIntervalId(false) : setIntervalId(true);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(latitude, longitude);
            },
            error => {
                setError(error);
                setLoading(false);
            }
        );

        const notificationCheck = async () => {
            try {
                const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    if (userData.notificationsEnabled) {
                        navigator.geolocation.getCurrentPosition(
                            async position => {
                                const { latitude, longitude } = position.coords;
                                fetchWeatherData(latitude, longitude);
                            },
                            error => {
                                setError(error);
                                setLoading(false);
                            }
                        );
                        notify(weatherData);
                    }
                }
            } catch (error) {
                console.error('Error fetching temperature unit preference:', error);
            }
        };

        setInterval(() => {
            notificationCheck();
        }, 60000);

        const fetchTemperatureUnit = async () => {
            try {
                const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setTemperatureUnit(userData.temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric');
                }
            } catch (error) {
                console.error('Error fetching temperature unit preference:', error);
            }
        };
        fetchTemperatureUnit();
    }, [temperatureUnit]);

    const fetchWeatherData = (latitude, longitude) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${temperatureUnit}`)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${temperatureUnit}`)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
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
        <Box display="flex" justifyContent="center" alignItems="center" minWidth="100vw" minHeight="100vh">
            <Grid display="flex" justifyContent="center" container spacing={4}>
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h2" align="center" color="#ff7f50" gutterBottom>
                                Climate Wise
                            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
                                Your reliable source for weather information
                            </Typography>
                            <Box mt={3}>
                                {weatherData && weatherData.main && weatherData.main.temp ? (
                                    <Typography variant="h3" component="span" color="#ff7f50">
                                        {`${Math.round(weatherData.main.temp)}${temperatureUnit === 'imperial' ? '°F' : '°C'}`}
                                    </Typography>
                                ) : (
                                    <Typography variant="h3" component="span" color="#ff7f50">
                                        Error unable to load
                                    </Typography>
                                )}
                                {weatherData && weatherData.weather && weatherData.weather[0] && weatherData.weather[0].description ? (
                                    <Typography variant="h6" component="span" color="textSecondary">
                                        {' - '}
                                        {weatherData.weather[0].description}
                                    </Typography>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Typography variant="body1" color="textSecondary">
                                    Location: {weatherData ? weatherData.name : ""}
                                </Typography>
                            </Box>
                            <Box mt={2}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Box display="flex" alignItems="center">
                                            <WbSunny />
                                            <Typography variant="body1" ml={1}>
                                                {weatherData.main && weatherData.main.humidity ? `${weatherData.main.humidity}%` : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box display="flex" alignItems="center">
                                            <CloudQueue />
                                            <Typography variant="body1" ml={1}>
                                                {weatherData.wind && typeof weatherData.wind.speed === 'number'
                                                    ? `${weatherData.wind.speed} ${temperatureUnit === 'metric' ? 'm/s' : 'mph'}`
                                                    : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box display="flex" alignItems="center">
                                            <AirlineSeatIndividualSuite />
                                            <Typography variant="body1" ml={1}>
                                                {weatherData.sys && typeof weatherData.sys.sunrise === 'number'
                                                    ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()
                                                    : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box display="flex" alignItems="center">
                                            <WbTwilight />
                                            <Typography variant="body1" ml={1}>
                                                {weatherData.sys && typeof weatherData.sys.sunset === 'number'
                                                    ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()
                                                    : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={3}>
                                <form onSubmit={handleSearch}>
                                    <Box display="flex" alignItems="center">
                                        <TextField
                                            variant="outlined"
                                            placeholder="Search for a location"
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        style={{ backgroundColor: "#ff7f50" }}
                                                        startIcon={<SearchIcon />}
                                                    >
                                                        Search
                                                    </Button>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </form>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <ToastContainer />
        </Box>
    );
}
