import ReCAPTCHA from "react-google-recaptcha";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const Main = () => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const API_KEY_MAPS = process.env.REACT_APP_API_KEY_MAPS;
    const URL_GET_SPEED_SITE_HOUR = process.env.REACT_APP_URL_GET_SPEED_SITE_HOUR;
    const URL_PREDICT = process.env.REACT_APP_URL_PREDICT;

    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [isPrecipitacionManual, setIsPrecipitacionManual] = useState(true);
    const [isPAceleracionManual, setIsPAceleracionManual] = useState(true);
    const [isVisibilidadManual, setIsVisibilidadManual] = useState(true);
    const [isAceleracionManual, setIsAceleracionManual] = useState(true);
    const [isVelocidadManual, setIsVelocidadManual] = useState(true);
    const [isCardiacoManual, setIsCardiacoManual] = useState(true);
    const [isClimaManual, setIsClimaManual] = useState(true);
    const [isTMotorManual, setIsTMotorManual] = useState(true);
    const [isCMotorManual, setIsCMotorManual] = useState(true);
    const [captchaValido, setCaptchaValido] = useState(false);
    const [isRpmManual, setIsRpmManual] = useState(true);
    const [isOnHourManual, setIsOnHourManual] = useState(true);
    const [isOnsiteManual, setIsOnsiteManual] = useState(true);
    const [isDesingManual, setIsDesingManual] = useState(true);   

    const [comboboxPrecipitacion, setComboboxPrecipitacion] = useState('');
    const [comboboxPAceleracion, setComboboxPAceleracion] = useState('');
    const [comboboxAceleracion, setComboboxAceleracion] = useState('');
    const [comboboxVisibilidad, setComboboxVisibilidad] = useState('');
    const [comboboxVelocidad, setComboboxVelocidad] = useState('');
    const [comboboxCardiaco, setComboboxCardiaco] = useState('');
    const [mostrarEtiqueta, setMostrarEtiqueta] = useState(true);
    const [resultado, setResultado] = useState('Calculando...');

    const [comboboxTMotor, setComboboxTMotor] = useState('');
    const [comboboxCMotor, setComboboxCMotor] = useState('');
    const [comboboxClima, setComboboxClima] = useState('');
    const [precipitacion, setPrecipitacion] = useState('');
    const [paceleracion, setPAceleracion] = useState('');
    const [aceleracion, setAceleracion] = useState('');
    const [visibilidad, setVisibilidad] = useState('');
    const [comboboxRpm, setComboboxRpm] = useState('');
    const [color, setColor] = useState('transparent');
    const [cargando, setCargando] = useState(false);
    const [velocidad, setVelocidad] = useState('');
    const [longitud, setLongitud] = useState('');
    const [cardiaco, setCardiaco] = useState('');
    const [latitud, setLatitud] = useState('');
    const [tmotor, setTmotor] = useState('');
    const [cmotor, setCmotor] = useState('');
    const [onsite, setOnsite] = useState('');
    const [onhour, setOnHour] = useState('');
    const [desing, setDesing] = useState('');
    const recaptchaRef = React.createRef();
    const [clima, setClima] = useState('');
    const [hora, setHora] = useState('0');
    const [rpm, setRpm] = useState('');
    const [aceleracionError, setAceleracionError] = useState('');
    const [precipitacionError, setPrecipitacionError] = useState('');
    const [paceleracionError, setPAceleracionError] = useState('');
    const [visibilidadError, setVisibilidadError] = useState('');
    const [velocidadError, setVelocidadError] = useState('');
    const [longitudError, setLongitudError] = useState('');
    const [cardiacoError, setCardiacoError] = useState('');
    const [latitudError, setLatitudError] = useState('');
    const [tmotorError, setTmotorError] = useState('');
    const [cmotorError, setCmotorError] = useState('');
    const [onsiteError, setOnsiteError] = useState('');
    const [desingError, setDesingError] = useState('');
    const [climaError, setClimaError] = useState('');
    const [rpmError, setRpmError] = useState('');
    const [onhourError, setOnHourError] = useState('');

    const fetchWeatherData = useCallback((latitud, longitud) => {
        const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${latitud},${longitud}&language=es-EC&details=true&toplevel=false`;    
        axios.get(locationUrl)
            .then(locationResponse => {
                const locationKey = locationResponse.data.Key;
                const weatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&language=es-EC&details=true`;
                return axios.get(weatherUrl);
            })
            .then(weatherResponse => {
                const weatherData = weatherResponse.data[0];
                setClima(weatherData.WeatherIcon);
                setVisibilidad(weatherData.Visibility.Metric.Value);
                setPrecipitacion(weatherData.PrecipitationSummary.Precipitation.Metric.Value);
    
                // Deshabilitar inputs y listas de opciones solo para clima, visibilidad y precipitación
                setIsClimaManual(false);
                setIsVisibilidadManual(false);
                setIsPrecipitacionManual(false);
            })
            .catch(() => {
                setClima(0);
                setVisibilidad(0);
                setPrecipitacion(0);
            });
    }, [API_KEY]);
    
    const disableFields = useCallback(() => {
        if (!isOnHourManual) {
            document.getElementById('onHourInput').disabled = true;
        }
        if (!isOnsiteManual) {
            document.getElementById('onsiteInput').disabled = true;
        }
        if (!isDesingManual) {
            document.getElementById('desingInput').disabled = true;
        }
    }, [isOnHourManual, isOnsiteManual, isDesingManual]);

    const get_speed_site_hour = useCallback((latitud, longitud, hour) => {
        const data = {
            latitude: latitud,
            longitude: longitud,
            time: hour
        };
    
        axios.post(URL_GET_SPEED_SITE_HOUR, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const parsedBody = JSON.parse(response.data.body);
    
            setOnHour(parsedBody.num_accidents_time);
            setOnsite(parsedBody.num_accidents_onsitu);
            setDesing(parsedBody.design_speed);
    
            setIsOnHourManual(false);
            setIsOnsiteManual(false);
            setIsDesingManual(false);
            disableFields()
        })
        .catch(() => {
            setOnHour(0);
            setOnsite(0);
            setDesing(0);
        });
    }, [URL_GET_SPEED_SITE_HOUR, disableFields]);   

    useEffect(() => {
        const loadGoogleMapsScript = () => {
          if (document.getElementById('googleMapsScript')) return; // Evita cargar el script si ya está presente
    
          const script = document.createElement('script');
          script.id = 'googleMapsScript'; // Asignamos un id para identificarlo
          script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPS}&callback=initMap`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        };
    
        // Definimos la función initMap de manera global
        window.initMap = () => {
          if (!window.google || !window.google.maps) {
            console.error("Google Maps API no se ha cargado correctamente.");
            return;
          }
    
          const bounds = {
            north: -0.003,
            south: -0.510,
            east: -78.200,
            west: -78.620,
          };
    
          // Inicialización del mapa
          mapRef.current = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: -0.210297, lng: -78.490189 },
            zoom: 15,
            mapTypeControl: false, // Quitar opciones de relieve y satélite
            restriction: {
              latLngBounds: bounds,
              strictBounds: true,
            },
          });
    
          // Listener para el evento de click
          mapRef.current.addListener('click', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setLatitud(lat.toFixed(6));
            setLongitud(lng.toFixed(6));
    
            if (markerRef.current) {
              markerRef.current.setMap(null); // Eliminar el marcador anterior
            }
    
            // Añadir nuevo marcador
            markMap(lat, lng);
            fetchWeatherData(lat, lng);
            get_speed_site_hour(lat, lng, hora);
          });
        };
    
        // Si Google Maps no está disponible, lo cargamos
        if (!window.google || !window.google.maps) {
          loadGoogleMapsScript();
        } else {
          // Si ya está cargado, solo llamamos a initMap
          window.initMap();
        }
    
        // Cleanup: no eliminamos initMap para que esté disponible siempre que sea necesario
        return () => {
          // No eliminamos `initMap`, ya que queremos que sea accesible cuando sea necesario
          // Si decides eliminarla, descomenta la siguiente línea:
          // delete window.initMap;
        };
      }, [API_KEY_MAPS, fetchWeatherData, get_speed_site_hour, hora]); // Dependencias ajustadas
    
      // Función para marcar el mapa en las coordenadas especificadas
      const markMap = (latitud, longitud) => {
        const lat = parseFloat(latitud);
        const lng = parseFloat(longitud);
    
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
        });
      };
    
      // Función para recalcular la posición del mapa y centrarlo en las nuevas coordenadas
      const calculateInMap = (latitud, longitud) => {
        const lat = parseFloat(latitud);
        const lng = parseFloat(longitud);
    
        if (markerRef.current) {
          markerRef.current.setMap(null); // Eliminar marcador anterior
        }
    
        markMap(lat, lng);
        mapRef.current.setCenter({ lat, lng });
      };
    
    const handleComboboxChange = (e, setCombobox, setValue, setIsManual, setError, ranges) => {
        const selectedValue = e.target.value;
        setCombobox(selectedValue);
    
        if (selectedValue === "") {
            setValue("");
            setIsManual(true);
        } else {
            setIsManual(false);
            const [min, max] = ranges[selectedValue] || [0, 0];
            const randomValue = (min === max) ? "0" : (Math.random() * (max - min) + min).toFixed(1);
            setValue(randomValue);
        }
        setError('');
    };
    
    const ranges = {
        precipitacion:  { "0": [0, 0],      "1": [0, 2.4],      "2": [2.5, 10.0],   "3": [10.1, 50.0],  "4": [50.1, 100.0] },
        velocidad:      { "0": [0, 0],      "1": [0, 10],       "2": [11, 20],      "3": [21, 40],      "4": [41, 100] },
        visibilidad:    { "0": [0, 0],      "1": [0, 2.4],      "2": [2.5, 10.0],   "3": [10.1, 50.0],  "4": [50.1, 100.0] },
        cardiaco:       { "0": [0, 59],     "1": [60, 80],      "2": [81, 100],     "3": [101, 120],    "4": [121, 180] },
        pAceleracion:   { "0": [0, 15],     "1": [16, 20],      "2": [21, 25],      "3": [26, 30] },
        tMotor:         { "0": [0, 82],     "1": [83, 94],      "2": [95, 104],     "3": [105, 200] },
        cMotor:         { "0": [0, 10],     "1": [11, 13],      "2": [14, 15],      "3": [16, 20] },
        rpm:            { "0": [0, 1500],   "1": [1501, 3000],  "2": [3001, 5000],  "3": [5001, 8000] },
        aceleracion:    { "0": [0, 15],     "1": [16, 20],      "2": [21, 25],      "3": [26, 30] }
    };
    
    const createComboboxHandler = (setCombobox, setValue, setIsManual, setError, rangeKey) =>
        (e) => handleComboboxChange(e, setCombobox, setValue, setIsManual, setError, ranges[rangeKey]);
    
    const handleComboboxChangePrecipitacion = createComboboxHandler(setComboboxPrecipitacion, setPrecipitacion, setIsPrecipitacionManual, setPrecipitacionError, 'precipitacion');
    const handleComboboxChangeVelocidad = createComboboxHandler(setComboboxVelocidad, setVelocidad, setIsVelocidadManual, setVelocidadError, 'velocidad');
    const handleComboboxChangeCardiaco = createComboboxHandler(setComboboxCardiaco, setCardiaco, setIsCardiacoManual, setCardiacoError, 'cardiaco');
    const handleComboboxChangePAceleracion = createComboboxHandler(setComboboxPAceleracion, setPAceleracion, setIsPAceleracionManual, setPAceleracionError, 'pAceleracion');
    const handleComboboxChangeTMotor = createComboboxHandler(setComboboxTMotor, setTmotor, setIsTMotorManual, setTmotorError, 'tMotor');
    const handleComboboxChangeCMotor = createComboboxHandler(setComboboxCMotor, setCmotor, setIsCMotorManual, setCmotorError, 'cMotor');
    const handleComboboxChangeRpm = createComboboxHandler(setComboboxRpm, setRpm, setIsRpmManual, setRpmError, 'rpm');
    const handleComboboxChangeVisibilidad = createComboboxHandler(setComboboxVisibilidad, setVisibilidad, setIsVisibilidadManual, setVisibilidadError, 'visibilidad');
    const handleComboboxChangeAceleracion = createComboboxHandler(setComboboxAceleracion, setAceleracion, setIsAceleracionManual, setAceleracionError, 'aceleracion');

    const obtenerColorFondo = (nivel) => {
        switch (nivel) {
            case 1:
                return 'green';
            case 2:
                return 'yellow';
            case 3:
                return 'orange';
            case 4:
                return 'red';
            default:
                return 'transparent';
        }
    };

    const handleComboboxChangeClima = (e) => {
        const selectedValue = e.target.value;
        setComboboxClima(selectedValue);

        if (selectedValue === "") {
            setClima("");
            setIsClimaManual(true);
        } else {
            setIsClimaManual(false);
        }

        setClima(selectedValue);
    };

    const handleCaptchaChange = (value) => {
        if(value)
        {
            setCaptchaValido(true);
        }
    };

    const validationRules = {
        "Latitud": { min: -90, max: 90 },
        "Longitud": { min: -180, max: 180 },
        "Accidentes sitio": { min: 0, max: 100, integer: true },
        "Velocidad diseño": { min: 0, max: 200, integer: true },
        "Accidentes hora": { min: 0, max: 100, integer: true },
        "Velocidad": { min: 0, max: 100},
        "Revoluciones": { min: 0, max: 8000},
        "Aceleración": { min: 0, max: 30 },
        "Posición Acelerador": { min: 0, max: 30},
        "Temperatura Motor": { min: 0, max: 200},
        "Carga Motor": { min: 0, max: 100},
        "Ritmo Cardiaco": { min: 0, max: 200 },
        "Clima": { min: 1, max: 35, integer: true },
        "Visibilidad": { min: 0, max: 100 },
        "Precipitación": { min: 0, max: 100}
    };
    
    const validateNumber = (setter, setError, type) => (e) => {
        const value = e.target.value;
        const regex = /^-?\d*\.?\d*$/;
        const rules = validationRules[type];
    
        if (regex.test(value) || value === '') {
            let error = '';
    
            if (rules) {
                if (rules.min !== undefined && parseFloat(value) < rules.min) {     // Validación de rango
                    error = `El valor debe ser mayor o igual a ${rules.min}.`;
                }
                if (rules.max !== undefined && parseFloat(value) > rules.max) {
                    error = `El valor debe ser menor o igual a ${rules.max}.`;
                }
    
                if (rules.integer && !Number.isInteger(parseFloat(value))) {        // Validación de número entero
                    error = 'Por favor, ingrese un número entero positivo.';
                }
            }
    
            if (error) {
                setError('*' + '    '.repeat(27) + error);
                setter('');
            } else {
                setter(value);
                setError('');
            }
        } else {
            setError('*' + '    '.repeat(27) + 'Por favor, ingrese solo números.');
            setter('');
        }
    };
    
    const validateNumberAceleracion = validateNumber(setAceleracion, setAceleracionError, "Aceleración");
    const validateNumberPAceleracion = validateNumber(setPAceleracion, setPAceleracionError, "Posición Acelerador");
    const validateNumberPrecipitacion = validateNumber(setPrecipitacion, setPrecipitacionError, "Precipitación");
    const validateNumberVisibilidad = validateNumber(setVisibilidad, setVisibilidadError, "Visibilidad");
    const validateNumberVelocidad = validateNumber(setVelocidad, setVelocidadError, "Velocidad");
    const validateNumberLongitud = validateNumber(setLongitud, setLongitudError, "Longitud");
    const validateNumberCardiaco = validateNumber(setCardiaco, setCardiacoError, "Ritmo Cardiaco");
    const validateNumberLatitud = validateNumber(setLatitud, setLatitudError, "Latitud");
    const validateNumberTmotor = validateNumber(setTmotor, setTmotorError, "Temperatura Motor");
    const validateNumberCmotor = validateNumber(setCmotor, setCmotorError, "Carga Motor");
    const validateNumberOnSite = validateNumber(setOnsite, setOnsiteError, "Accidentes sitio");
    const validateNumberDesing = validateNumber(setDesing, setDesingError, "Velocidad diseño");
    const validateNumberClima = validateNumber(setClima, setClimaError, "Clima");
    const validateNumberRpm = validateNumber(setRpm, setRpmError, "Revoluciones");
    const validateNumberOnHour = validateNumber(setOnHour, setOnHourError, "Accidentes hora");

    const validateInputs = () => {
        const camposFaltantes = [];

        if (!paceleracion) camposFaltantes.push("Posición acelerador");
        if (!tmotor) camposFaltantes.push("Temperatura motor");
        if (!onsite) camposFaltantes.push("Accidentes sitio");
        if (!desing) camposFaltantes.push("Velocidad diseño");
        if (!cardiaco) camposFaltantes.push("Ritmo cardiaco");
        if (!aceleracion) camposFaltantes.push("Aceleración");
        if (!onhour) camposFaltantes.push("Accidentes hora");
        if (!velocidad) camposFaltantes.push("Velocidad");
        if (!cmotor) camposFaltantes.push("Carga motor");
        if (!longitud) camposFaltantes.push("Longitud");
        if (!latitud) camposFaltantes.push("Latitud");
        if (!clima) camposFaltantes.push("Clima");
        if (!rpm) camposFaltantes.push("Rpm");

        if (camposFaltantes.length > 0) {
            alert(`Por favor, llena los siguientes campos: ${camposFaltantes.join(", ")}`);
            return false;
        }
        return true;
    };

    const resetFields = () => {
        setIsPrecipitacionManual(true);
        setIsPAceleracionManual(true);
        setIsAceleracionManual(true);
        setIsVisibilidadManual(true);
        setIsVelocidadManual(true);
        setIsCardiacoManual(true);
        setIsClimaManual(true);
        setIsTMotorManual(true);
        setIsCMotorManual(true);
        setIsRpmManual(true);
        setComboboxPrecipitacion('');
        setComboboxPAceleracion('');
        setComboboxVisibilidad('');
        setComboboxVelocidad('');
        setComboboxCardiaco('');
        setComboboxTMotor('');
        setComboboxCMotor('');
        setComboboxClima('');
        setComboboxRpm('');
        setPrecipitacion('');
        setPAceleracion('');
        setVisibilidad('');
        setVelocidad('');
        setCardiaco('');
        setLongitud('');
        setLatitud('');
        setTmotor('');
        setCmotor('');
        setOnsite('');
        setDesing('');
        setOnHour('');
        setClima('');
        setHora('0');
        setRpm('');
        setCargando(false);
    };
    
    const handleCalculateClick = () => {
        if (captchaValido) {
            recaptchaRef.current.reset();
            setCaptchaValido(false);
        } else {
            alert("Por favor, completa el reCAPTCHA.");
            setMostrarEtiqueta(true);
            return;
        }
    
        if (validateInputs()) {
            setMostrarEtiqueta(false);
    
            const data = JSON.stringify({
                "Input": [[
                    parseFloat(99),
                    parseFloat(velocidad),
                    parseFloat(rpm),
                    parseFloat(aceleracion),
                    parseFloat(paceleracion),
                    parseFloat(tmotor),
                    parseFloat(cmotor),
                    parseFloat(cardiaco),
                    parseFloat(99),
                    parseFloat(latitud),
                    parseFloat(longitud),
                    parseFloat(clima),
                    parseFloat(onsite)
                ]]
            });
    
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: URL_PREDICT,
                data: data
            };
    
            axios(config)
                .then(response => {
                    const respuestaAgente = JSON.stringify(response.data);
                    const parsedData = JSON.parse(respuestaAgente);
                    const numero = parsedData.Output;
    
                    console.log(respuestaAgente);
                    alert(respuestaAgente);
    
                    const riskLevels = ['Bajo', 'Medio', 'Alto', 'Muy Alto'];
                    setResultado(riskLevels[numero - 1] || 'Desconocido');
                    setColor(obtenerColorFondo(numero));
                })
                .catch(error => {
                    console.log(error);
                    setResultado('Error al calcular el nivel de riesgo');
                    setColor('red');
                    alert('No se pudo establecer conexión o ocurrió un error: ' + error.message);
                })
                .finally(() => {
                    resetFields();
                    setIsPrecipitacionManual(true);
                });
        } else {
            setMostrarEtiqueta(true);
        }
    };
    
    const handleDeleteClick = () => {
        setColor(obtenerColorFondo(0));
        setResultado('Calculando...');
        resetFields();
    };

    const comboLabelsFinal = ["km/h", "rev/min", "m/s²", "%", "°C", "%", "°", "km", "lpm", "mm"];

    const comboLabels = ["Velocidad ", "Revoluciones ", "Aceleración ",
        "Pos. Acelerador ", "Temp. Motor ", "Carga Motor ",
        "Áng. Dirección ", "Dist. Recorrida ", "Acc. en Sitio ",
        "Ritmo Cardiaco ", "Clima ", "Visibilidad ",
        "Precipitación ", "Latitud ", "Longitud ",
        "Hora ", "Accidentes sitio ", "Velocidad diseño ", "Accidentes hora "];

    return (
        <div style={{ margin: '20px 0 10px 0', 
            position: 'relative', 
            width: '100%', 
            boxSizing: 'border-box',
            paddingLeft: '4%'
             }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', transform: 'scale(0.80)' }}>
                {
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, marginRight: '-30px', marginLeft: '-150px' }}>

                            {/* Latitud */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[13]}:</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={latitud}
                                        onChange={validateNumberLatitud}
                                        onBlur={() => {
                                            if (latitud && longitud) {
                                                fetchWeatherData(latitud, longitud);
                                                calculateInMap(latitud, longitud)
                                                get_speed_site_hour(latitud, longitud, hora);
                                            }
                                        }}
                                        style={{ marginRight: '10px', width: '200px', height: '22px', fontSize: '15px' }}
                                    />
                                    <label style={{ marginRight: '10px', width: '330px', fontSize: '15px', color: 'blue' }}>° decimales (p. ej. -0.29795)</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{latitudError}</span>
                            </div>

                            {/* Longitud */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[14]}:</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={longitud}
                                        onChange={(e) => validateNumberLongitud(e, setLongitud)}
                                        onBlur={() => {
                                            if (latitud && longitud) {
                                                fetchWeatherData(latitud, longitud);
                                                calculateInMap(latitud, longitud)
                                                get_speed_site_hour(latitud, longitud, hora);
                                            }
                                        }}
                                        style={{ marginRight: '10px', width: '200px', height: '22px', fontSize: '15px' }}
                                    />
                                    <label style={{ marginRight: '10px', width: '330px', fontSize: '15px', color: 'blue' }}>° decimales (p. ej. -78.46044)</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{longitudError}</span>
                            </div>

                            {/* Hora */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[15]}:</label>
                                <select
                                    value={hora}
                                    onChange={(e) => setHora(e.target.value)}
                                    style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                >
                                    {[...Array(24)].map((_, i) => (
                                        <option key={i} value={i}>{`${i.toString().padStart(2, '0')}:00`}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Añadir separador */}
                            <div style={{ marginBottom: '5px', marginTop: '5px' }}>
                                <div style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>
                                        {'–'.repeat(95)}
                                    </label>
                                </div>
                            </div>

                            {/* OnSite */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[16]}:</label>
                                    <input
                                        id="onsiteInput"
                                        type="text"
                                        placeholder=""
                                        value={onsite}
                                        onChange={(e) => validateNumberOnSite(e, setOnsite)}
                                        style={{ marginRight: '10px', width: '200px', height: '22px', fontSize: '15px' }}
                                    />
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{onsiteError}</span>
                            </div>

                            {/* Vel. Diseño */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[17]}:</label>
                                    <input
                                        id = "desingInput"
                                        type="text"
                                        placeholder=""
                                        value={desing}
                                        onChange={(e) => validateNumberDesing(e, setDesing)}
                                        style={{ marginRight: '10px', width: '200px', height: '22px', fontSize: '15px' }}
                                    />
                                    <label style={{ width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[0]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{desingError}</span>
                            </div>

                            {/* OnHour */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[18]}:</label>
                                    <input
                                        id = "onHourInput"
                                        type="text"
                                        placeholder=""
                                        value={onhour}
                                        onChange={(e) => validateNumberOnHour(e, setOnHour)}
                                        style={{ marginRight: '10px', width: '200px', height: '22px', fontSize: '15px' }}
                                    />
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{onhourError}</span>
                            </div>

                            {/* Añadir separador */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px' }}>
                                <div style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>
                                        {'–'.repeat(95)}
                                    </label>
                                </div>
                            </div>

                            {/* Velocidad */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[0]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeVelocidad}
                                        value={comboboxVelocidad}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Normal:    [0-0]</option>
                                        <option value={1}>Ligera:    [1-10]</option>
                                        <option value={2}>Moderada:  [11-20]</option>
                                        <option value={3}>Seria:     [21-40]</option>
                                        <option value={4}>Muy Seria: [41-100]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={velocidad}
                                        onChange={validateNumberVelocidad}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isVelocidadManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[0]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{velocidadError}</span>
                            </div>

                            {/* RPM */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[1]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeRpm}
                                        value={comboboxRpm}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-1500]</option>
                                        <option value={1}>Normal:   [1501-3000]</option>
                                        <option value={2}>Alto:     [3001-5000]</option>
                                        <option value={3}>Muy Alto: [5001-8000]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={rpm}
                                        onChange={validateNumberRpm}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isRpmManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[1]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{rpmError}</span>
                            </div>

                            {/* Aceleración */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[2]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeAceleracion}
                                        value={comboboxAceleracion}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-15]</option>
                                        <option value={1}>Normal:   [16-20]</option>
                                        <option value={2}>Alto:     [21-25]</option>
                                        <option value={3}>Muy ALto: [26-30]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={aceleracion}
                                        onChange={validateNumberAceleracion}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isAceleracionManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[2]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{aceleracionError}</span>
                            </div>


                            {/* Posición del Acelerador */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[3]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangePAceleracion}
                                        value={comboboxPAceleracion}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-15]</option>
                                        <option value={1}>Normal:   [16-20]</option>
                                        <option value={2}>Alto:     [21-25]</option>
                                        <option value={3}>Muy ALto: [26-30]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={paceleracion}
                                        onChange={validateNumberPAceleracion}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isPAceleracionManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[3]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{paceleracionError}</span>
                            </div>

                            {/* Temperatura del Motor */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[4]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeTMotor}
                                        value={comboboxTMotor}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:               [0-82]</option>
                                        <option value={1}>Nornal:             [83-94]</option>
                                        <option value={2}>Alto:               [95-104]</option>
                                        <option value={3}>Sobrecalentamiento: [105-200]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={tmotor}
                                        onChange={validateNumberTmotor}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isTMotorManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[4]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{tmotorError}</span>
                            </div>

                            {/* Carga del Motor */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[5]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeCMotor}
                                        value={comboboxCMotor}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-10]</option>
                                        <option value={1}>Normal:   [1-13]</option>
                                        <option value={2}>Alto:     [13-15]</option>
                                        <option value={3}>Muy ALto: [15-20]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={cmotor}
                                        onChange={validateNumberCmotor}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isCMotorManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[3]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{cmotorError}</span>
                            </div>

                            {/* Añadir separador */}
                            <div style={{ marginBottom: '5px', marginTop: '5px' }}>
                                <div style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>
                                        {'–'.repeat(95)}
                                    </label>
                                </div>
                            </div>

                            {/* Ritmo Cardiaco */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[9]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeCardiaco}
                                        value={comboboxCardiaco}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bradicardia:        [0-59]</option>
                                        <option value={1}>Sinus zona a:       [60-80]</option>
                                        <option value={2}>Sinus zona b:       [81-100]</option>
                                        <option value={3}>Tachycardia Slight: [101-120]</option>
                                        <option value={4}>Tachycardia Severe: [121-180]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={cardiaco}
                                        onChange={validateNumberCardiaco}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isCardiacoManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[8]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px',   whiteSpace: 'pre' }}>{cardiacoError}</span>
                            </div>
                            

                            {/* Añadir separador */}
                            <div style={{ marginBottom: '5px', marginTop: '5px' }}>
                                <div style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>
                                        {'–'.repeat(95)}
                                    </label>
                                </div>
                            </div>

                            {/* Clima */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[10]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeClima}
                                        value={comboboxClima}
                                    >
                                        <option value="">Manual</option>
                                        <option value={1}>Soleado:               [1]</option>
                                        <option value={2}>Mayormente Soleado:    [2]</option>
                                        <option value={3}>Parcialmente Soleado:  [3]</option>
                                        <option value={5}>Sol Brumoso:           [5]</option>
                                        <option value={6}>Mayormente Nublado:    [6]</option>
                                        <option value={7}>Nublado:               [7]</option>
                                        <option value={9}>Nubes y Sol:           [9]</option>
                                        <option value={11}>Niebla:               [11]</option>
                                        <option value={18}>Lluvia:               [18]</option>
                                        <option value={35}>Parcialmente Nublado: [35]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={clima}
                                        onChange={validateNumberClima}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isClimaManual}
                                    />
                                </div>
                                <span style={{ color: 'red', fontSize: '12px', whiteSpace: 'pre' }}>{climaError}</span>
                            </div>

                            {/* Visibilidad */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[11]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangeVisibilidad}
                                        value={comboboxVisibilidad}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Mala:      [0-0]</option>
                                        <option value={1}>Pobre:     [0.1-2.4]</option>
                                        <option value={2}>Moderada:  [2.5-10.0]</option>
                                        <option value={3}>Buena:     [10.1-50.0]</option>
                                        <option value={4}>Excelente: [50.1-100.0]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={visibilidad}
                                        onChange={validateNumberVisibilidad}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isVisibilidadManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-30px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[7]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px', whiteSpace: 'pre' }}>{visibilidadError}</span>
                            </div>

                            {/* Precipitación */}
                            <div align='left' style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>{comboLabels[12]}:</label>
                                    <select
                                        style={{ width: '200px', height: '22px', fontSize: '15px' }}
                                        onChange={handleComboboxChangePrecipitacion}
                                        value={comboboxPrecipitacion}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Ninguna:  [0.0-0.0]</option>
                                        <option value={1}>Ligera:   [0.1-2.4]</option>
                                        <option value={2}>Moderada: [2.5-10.0]</option>
                                        <option value={3}>Pesada:   [10.1-50.0]</option>
                                        <option value={4}>Violenta: [50.1-100.0]</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={``}
                                        value={precipitacion}
                                        onChange={validateNumberPrecipitacion}
                                        style={{ marginLeft: '25px', marginRight: '25px', width: '200px', height: '22px', fontSize: '15px' }}
                                        disabled={!isPrecipitacionManual}
                                    />
                                    <label style={{ marginLeft: '-20px', marginRight: '-300px', width: '75px', fontSize: '15px', color: 'blue' }}>{comboLabelsFinal[9]}</label>
                                </div>
                                <span style={{ color: 'red', fontSize: '12px', whiteSpace: 'pre' }}>{precipitacionError}</span>
                            </div>

                            {/* Añadir separador */}
                            <div style={{ marginBottom: '5px', marginTop: '5px' }}>
                                <div style={{ marginBottom: '5px', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>
                                        {'–'.repeat(200)}
                                    </label>
                                </div>
                            </div>

                            {/* reCAPTCHA */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey="6LfwVXYqAAAAAKB9S1HkKwMmBp1cisyFWveXg_s9"
                                    onChange={handleCaptchaChange}
                                />
                                {/* Información Campos */}
                                {mostrarEtiqueta && (
                                    <label
                                        style={{ marginLeft: '-190px', marginBottom: '-150px', color: 'red', fontSize: '15px' }}
                                    >
                                        Ingresar valores para todos los campos y realiza el reCAPTCHA par realizar la consulta
                                    </label>
                                )}
                            </div>

                            {/* Añadir separador */}
                            <div style={{ marginBottom: '60px', marginTop: '60px' }}>
                                <div style={{ marginBottom: '-50px', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px', width: '130px', fontSize: '15px' }}>
                                        {'–'.repeat(200)}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Mapa */}
                        <div style={{ flex: 1, marginLeft: '170px', marginTop: '90px', maxWidth: '1000px', transform: 'scale(1.25)'}}>
                            <div id="map" style={{ width: '550px', height: '420px', border: '2px solid gray', padding: '10px' }}></div>
                        </div>

                        {/* Sección de Resultados */}
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            {/* Botón Borrar */}
                            <button
                                style={{
                                    backgroundColor: '#3a75fc ',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '10px 26px',
                                    fontSize: '16px',
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '1050px',
                                    marginBottom: '30px'
                                }}
                                onClick={handleDeleteClick}
                            >
                                Borrar
                            </button>

                            {/* Botón Calcular */}
                            <button
                                style={{
                                    backgroundColor: '#3a75fc ',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '-150px',
                                    marginBottom: '30px'
                                }}
                                //disabled={!captchaValido}
                                onClick={handleCalculateClick}
                            >
                                Calcular
                            </button>

                            {/* Etiqueta Nivel Riesgo */}
                            <div
                                style={{
                                    margin: '10px 0',
                                    fontSize: '25px',
                                    position: 'absolute',
                                    bottom: '300px',
                                    left: '45%',
                                    marginBottom: '-165px',
                                    fontWeight: 'bold'
                                }}>
                                Nivel de riesgo:
                            </div>

                            {/* Etiqueta Resultado */}
                            <div
                                style={{
                                    backgroundColor: color,
                                    color: 'black',
                                    padding: '10px 10px',
                                    fontSize: '25px',
                                    position: 'absolute',
                                    bottom: '260px',
                                    left: '61%',
                                    marginBottom: '-135px',
                                    fontWeight: 'bold'
                                }}>
                                {cargando ? 'Calculando...' : resultado}
                            </div>
                        </div>
                    </div>
                
                }
            </div>
        </div>
    );
};

export default Main;