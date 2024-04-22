import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Grid } from '@mui/material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)({
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 flexWrap: 'wrap',
 gap:"2rem",
 width: '50%',
 height: 'max-content',
 backgroundColor: '#ffffff',
 borderRadius: '10px',
 boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
 padding: '20px',
 position: 'absolute',
 top:"50%",
 left:"50%",
 transform: 'translate(-50%,-50%)',
});

const StyledMap = styled(Box)({
 width: '100%',
 height: 'auto',
 backgroundColor: 'rgba(0,0,0)',
 marginRight:"40px"
});

const RadiusMap = () => {
 const [mapUrl, setMapUrl] = useState('');
 const [zoom, setZoom] = useState(1);
 const [x, setX] = useState(0);
 const [y, setY] = useState("0");
 const [layer, setLayer] = useState('clouds_new');
 const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

 useEffect(() => {
    const baseUrl = `https://tile.openweathermap.org/map/${layer}/${zoom}/${x}/${y}.png`;
    const url = `${baseUrl}?appid=${apiKey}`;
    setMapUrl(url);
 }, [zoom, x, y, layer, apiKey]);

 const handleZoomChange = (event) => {
    setZoom(event.target.value);
 };

 const handleXChange = (event) => {
    setX(event.target.value);
 };

 const handleYChange = (event) => {
    setY(event.target.value);
 };

 const handleLayerChange = (event) => {
    setLayer(event.target.value);
 };

 return (
    <StyledBox>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={6}>
          <StyledMap>
            <img src={mapUrl} alt="Weather Map" style={{ width: '100%', height: 'auto' }} />
          </StyledMap>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{display:"flex",
        gap:"1rem",flexDirection:"column"}}>
            <FormControl variant="outlined" style={{ width: '100%' }}>
             
              <TextField
                label="Zoom Level"
                type="number"
                value={zoom}
                onChange={handleZoomChange}
                inputProps={{ min: 1, max: 18 }}
                InputLabelProps={{ style: { color: '#ff6347' } }}
              />
            </FormControl>
            <FormControl variant="outlined" style={{ width: '100%' }}>
        
              <TextField
                label="X Coordinate"
                type="number"
                value={x}
                onChange={handleXChange}
                inputProps={{ min: 0, max: 180 }}
                InputLabelProps={{ style: { color: '#ff6347' } }}
              />
            </FormControl>
            <FormControl variant="outlined" style={{ width: '100%' }}>
        
              <TextField
                label="Y Coordinate"
                type="number"
                value={y}
                onChange={handleYChange}
                inputProps={{ min: 0, max: 180 }}
                InputLabelProps={{ style: { color: '#ff6347' } }}
              />
            </FormControl>
            <FormControl variant="outlined" style={{ width: '100%' }}>
              <InputLabel id="layer-label" style={{ color: '#ff6347' }}>Layer</InputLabel>
              <Select
                labelId="layer-label"
                value={layer}
                onChange={handleLayerChange}
                label="Layer"
                InputLabelProps={{ style: { color: '#ff6347' } }}
              >
                <MenuItem value="clouds_new">Clouds</MenuItem>
                <MenuItem value="precipitation_new">Precipitation</MenuItem>
                <MenuItem value="pressure_new">Pressure</MenuItem>
                <MenuItem value="wind_new">Wind</MenuItem>
                <MenuItem value="temp_new">Temperature</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </StyledBox>
 );
};

export default RadiusMap;