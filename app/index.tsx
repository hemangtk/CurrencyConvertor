
  import React, { useState, useEffect } from 'react';
  import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Alert,
    StatusBar
  } from 'react-native';
  import { Picker } from '@react-native-picker/picker';
  import AsyncStorage from  '@react-native-async-storage/async-storage';
  // import { StatusBar } from 'react-native';

  const EXCHANGE_RATE_API_KEY = '4282c9f71c035ca9e5d6e4fc';

  const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [baseCurrency, setBaseCurrency] = useState('INR');
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [exchangeRates, setExchangeRates] = useState({});

    const currencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 
      'AUD', 'CHF', 'CNY', 'INR', 'BRL'
    ];

    useEffect(() => {
      loadSavedPreferences();
      fetchExchangeRates();
    }, []);

    const loadSavedPreferences = async () => {
      try {
        const savedBaseCurrency = await AsyncStorage.getItem('baseCurrency');
        const savedTargetCurrency = await AsyncStorage.getItem('targetCurrency');
        
        if (savedBaseCurrency) setBaseCurrency(savedBaseCurrency);
        if (savedTargetCurrency) setTargetCurrency(savedTargetCurrency);
      } catch (error) {
        console.error('Error loading preferences', error);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`
        );
        const data = await response.json();
        
        if (data.result === 'success') {
          setExchangeRates(data.conversion_rates);
        } else {
          Alert.alert('Error', 'Failed to fetch exchange rates');
        }
      } catch (error) {
        Alert.alert('Network Error', 'Unable to connect to exchange rate service');
      }
    };

    const convertCurrency = () => {
      const rate = exchangeRates[targetCurrency];
      if (rate && amount) {
        const converted = (parseFloat(amount) * rate).toFixed(2);
        setConvertedAmount(converted);
        savePreferences();
      }
    };

    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem('baseCurrency', baseCurrency);
        await AsyncStorage.setItem('targetCurrency', targetCurrency);
      } catch (error) {
        console.error('Error saving preferences', error);
      }
    };

    const swapCurrencies = () => {
      const temp = baseCurrency;
      setBaseCurrency(targetCurrency);
      setTargetCurrency(temp);
      fetchExchangeRates();
    };

    return (
      <>
        <Text style={styles.title}>Currency Converter</Text>
        
        <View style={styles.inputContainer}>
          <StatusBar hidden/>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Picker
            selectedValue={baseCurrency}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setBaseCurrency(itemValue);
              fetchExchangeRates();
            }}
          >
            {currencies.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.swapButton} 
          onPress={swapCurrencies}
        >
          <Text>⇄ Swap Currencies</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Picker
            selectedValue={targetCurrency}
            style={styles.picker}
            onValueChange={(itemValue) => setTargetCurrency(itemValue)}
          >
            {currencies.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.convertButton} 
          onPress={convertCurrency}
        >
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>

        {convertedAmount && (
          <Text style={styles.resultText}>
            {amount} {baseCurrency} = {convertedAmount} {targetCurrency}
          </Text>
        )}
      </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 15,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
      backgroundColor: 'white',
    },
    picker: {
      height: 50,
      width: '100%',
      backgroundColor: 'white',
    },
    swapButton: {
      padding: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
      marginVertical: 10,
    },
    convertButton: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
    convertButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    resultText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  export default CurrencyConverter;