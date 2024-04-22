import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Switch, Button } from '@mui/material';
import { auth } from '../../firebase/firebase';
import { getFirestore, doc, getDoc,setDoc } from 'firebase/firestore';

const SettingsPage = () => {
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setTemperatureUnit(userData.temperatureUnit || 'celsius');
          setNotificationsEnabled(userData.notificationsEnabled || false);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchPreferences();
  }, [db]);

  const handleTemperatureUnitChange = (event) => {
    const newTemperatureUnit = event.target.value;
    setTemperatureUnit(newTemperatureUnit);
    setHasUnsavedChanges(true);
  };

  const handleNotificationsChange = (event) => {
    const newNotificationsEnabled = event.target.checked;
    setNotificationsEnabled(newNotificationsEnabled);
    setHasUnsavedChanges(true);
  };

  const handleSavePreferences = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { temperatureUnit, notificationsEnabled }, { merge: true });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Box sx={{ marginBottom: '2rem' }}>
          <Typography variant="h6" gutterBottom>
            Temperature Unit
          </Typography>
          <FormControl>
            <FormLabel id="temperature-unit-label">Temperature Unit</FormLabel>
            <RadioGroup
              aria-labelledby="temperature-unit-label"
              name="temperature-unit"
              value={temperatureUnit}
              onChange={handleTemperatureUnitChange}
              row
            >
              <FormControlLabel value="celsius" control={<Radio />} label="Celsius" />
              <FormControlLabel value="fahrenheit" control={<Radio />} label="Fahrenheit" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: '2rem' }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <FormControl>
            <FormControlLabel
              control={<Switch checked={notificationsEnabled} onChange={handleNotificationsChange} />}
              label="Enable Notifications"
            />
          </FormControl>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePreferences}
          disabled={!hasUnsavedChanges}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;