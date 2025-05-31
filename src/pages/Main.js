import ReCAPTCHA from "react-google-recaptcha";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        })
        .catch(() => {
            setOnHour(0);
            setOnsite(0);
            setDesing(0);
        });
    }, [URL_GET_SPEED_SITE_HOUR]);
    
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
    
            mapRef.current.addListener('click', (e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setLatitud(lat.toFixed(6));
                setLongitud(lng.toFixed(6));
    
                if (markerRef.current) {
                    markerRef.current.setMap(null); // Eliminar el marcador anterior
                }
    
                markMap(lat, lng);
                fetchWeatherData(lat, lng);
                get_speed_site_hour(lat, lng, hora);
            });
        };
    
        if (!window.google || !window.google.maps) {
            loadGoogleMapsScript();
        } else {
            window.initMap();
        }
            return () => {
        };
    }, [API_KEY_MAPS, fetchWeatherData, get_speed_site_hour]); // Eliminamos `hora` de las dependencias
    
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
            setIsManual(true);
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
        if (!cardiaco) camposFaltantes.push("Ritmo cardiaco");
        if (!aceleracion) camposFaltantes.push("Aceleración");
        if (!velocidad) camposFaltantes.push("Velocidad");
        if (!cmotor) camposFaltantes.push("Carga motor");
        if (!longitud) camposFaltantes.push("Longitud");
        if (!latitud) camposFaltantes.push("Latitud");
        if (!clima) camposFaltantes.push("Clima");
        if (!rpm) camposFaltantes.push("Rpm");

        if (camposFaltantes.length > 0) {
            //alert(`Por favor, llena los siguientes campos: ${camposFaltantes.join(", ")}`);
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
        setComboboxAceleracion('');
        setComboboxVisibilidad('');
        setComboboxVelocidad('');
        setComboboxCardiaco('');
        setComboboxTMotor('');
        setComboboxCMotor('');
        setComboboxClima('');
        setComboboxRpm('');
        setPrecipitacion('');
        setPAceleracion('');
        setAceleracion('');
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
            //alert("Por favor, completa el reCAPTCHA.");
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
                    const parsedBody = JSON.parse(response.data.body);
                    const numero = parsedBody.Output;
                    
                    console.log(parsedBody); // o console.log(numero);
                    
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

    // Etiquetas
    const comboLabelsFinal = ["km/h", "rev/min", "m/s²", "%", "°C", "%", "°", "km", "lpm", "mm"];
    const comboLabels = ["Velocidad ", "Revoluciones ", "Aceleración ",
        "Pos. Acelerador ", "Temp. Motor ", "Carga Motor ",
        "Áng. Dirección ", "Dist. Recorrida ", "Acc. en Sitio ",
        "Ritmo Cardiaco ", "Clima ", "Visibilidad ",
        "Precipitación ", "Latitud ", "Longitud ",
        "Hora ", "Accidentes sitio ", "Velocidad diseño ", "Accidentes hora "];

    return (
        <div className="container-fluid py-4" style={{ minHeight: "100vh" }}>
            <div className="row h-100" style={{ minHeight: "80vh" }}>
                {/* Formulario */}
                <div className="col-lg-6 col-md-12 mb-4 d-flex flex-column" style={{ height: "100%" }}>
                    <form className="flex-grow-1 d-flex flex-column">
                        <div className="row g-3 flex-grow-1">
                            {/* Latitud */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[13]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={latitud}
                                        onChange={validateNumberLatitud}
                                        onBlur={() => {
                                            if (latitud && longitud) {
                                                fetchWeatherData(latitud, longitud);
                                                calculateInMap(latitud, longitud);
                                                get_speed_site_hour(latitud, longitud, hora);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-1">
                                    <div className="form-text text-primary">decimales</div>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{latitudError}</div>
                                </div>
                            </div>
                            {/* Longitud */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[14]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={longitud}
                                        onChange={validateNumberLongitud}
                                        onBlur={() => {
                                            if (latitud && longitud) {
                                                fetchWeatherData(latitud, longitud);
                                                calculateInMap(latitud, longitud);
                                                get_speed_site_hour(latitud, longitud, hora);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-1">
                                    <div className="form-text text-primary">decimales</div>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{longitudError}</div>
                                </div>
                            </div>
                            {/* Hora */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[15]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        value={hora}
                                        onChange={(e) => {
                                            const newHora = e.target.value;
                                            setHora(newHora);
                                            if (latitud && longitud) {
                                                get_speed_site_hour(latitud, longitud, newHora);
                                            }
                                        }}
                                    >
                                        {[...Array(24)].map((_, i) => (
                                            <option key={i} value={i}>{`${i.toString().padStart(2, '0')}:00`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-2"></div>
                                <div className="col-2"></div>
                            </div>
                            {/* Separador */}
                            <hr className="my-3" />
                            {/* OnSite */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[16]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <input
                                        id="onsiteInput"
                                        type="text"
                                        className="form-control text-center"
                                        value={onsite || 0}
                                        onChange={validateNumberOnSite}
                                        disabled
                                    />
                                </div>
                                <div className="col-2"></div>
                                <div className="col-3">
                                    <div className="text-danger small">{onsiteError}</div>
                                </div>
                            </div>
                            {/* Vel. Diseño */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[17]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <input
                                        id="desingInput"
                                        type="text"
                                        className="form-control text-center"
                                        value={desing || 0}
                                        onChange={validateNumberDesing}
                                        disabled
                                    />
                                </div>
                                <div className="col-1">
                                    <div className="form-text">{comboLabelsFinal[0]}</div>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{desingError}</div>
                                </div>
                            </div>
                            {/* OnHour */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[18]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <input
                                        id="onHourInput"
                                        type="text"
                                        className="form-control text-center"
                                        value={onhour || 0}
                                        onChange={validateNumberOnHour}
                                        disabled
                                    />
                                </div>
                                <div className="col-2"></div>
                                <div className="col-3">
                                    <div className="text-danger small">{onhourError}</div>
                                </div>
                            </div>
                            {/* Separador */}
                            <hr className="my-3" />
                            {/* Velocidad */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[0]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeVelocidad}
                                        value={comboboxVelocidad}
                                        disabled={!isVelocidadManual}
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
                                        className="form-control text-center"
                                        value={velocidad}
                                        onChange={validateNumberVelocidad}
                                        disabled={!isVelocidadManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[0]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{velocidadError}</div>
                                </div>
                            </div>
                            {/* RPM */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[1]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeRpm}
                                        value={comboboxRpm}
                                        disabled={!isRpmManual}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-1500]</option>
                                        <option value={1}>Normal:   [1501-3000]</option>
                                        <option value={2}>Alto:     [3001-5000]</option>
                                        <option value={3}>My Alto: [5001-8000]</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={rpm}
                                        onChange={validateNumberRpm}
                                        disabled={!isRpmManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[1]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{rpmError}</div>
                                </div>
                            </div>
                            {/* Aceleración */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[2]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeAceleracion}
                                        value={comboboxAceleracion}
                                        disabled={!isAceleracionManual}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-15]</option>
                                        <option value={1}>Normal:   [16-20]</option>
                                        <option value={2}>Alto:     [21-25]</option>
                                        <option value={3}>My Alto: [26-30]</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={aceleracion}
                                        onChange={validateNumberAceleracion}
                                        disabled={!isAceleracionManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[2]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{aceleracionError}</div>
                                </div>
                            </div>
                            {/* Posición del Acelerador */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[3]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangePAceleracion}
                                        value={comboboxPAceleracion}
                                        disabled={!isPAceleracionManual}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-15]</option>
                                        <option value={1}>Normal:   [16-20]</option>
                                        <option value={2}>Alto:     [21-25]</option>
                                        <option value={3}>My Alto: [26-30]</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={paceleracion}
                                        onChange={validateNumberPAceleracion}
                                        disabled={!isPAceleracionManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[3]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{paceleracionError}</div>
                                </div>
                            </div>
                            {/* Temperatura del Motor */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[4]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeTMotor}
                                        value={comboboxTMotor}
                                        disabled={!isTMotorManual}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:               [0-82]</option>
                                        <option value={1}>Nornal:             [83-94]</option>
                                        <option value={2}>Alto:               [95-104]</option>
                                        <option value={3}>Sobrecalentamiento: [105-200]</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={tmotor}
                                        onChange={validateNumberTmotor}
                                        disabled={!isTMotorManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[4]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{tmotorError}</div>
                                </div>
                            </div>
                            {/* Carga del Motor */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[5]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeCMotor}
                                        value={comboboxCMotor}
                                        disabled={!isCMotorManual}
                                    >
                                        <option value="">Manual</option>
                                        <option value={0}>Bajo:     [0-10]</option>
                                        <option value={1}>Normal:   [1-13]</option>
                                        <option value={2}>Alto:     [13-15]</option>
                                        <option value={3}>My Alto: [15-20]</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={cmotor}
                                        onChange={validateNumberCmotor}
                                        disabled={!isCMotorManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[3]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{cmotorError}</div>
                                </div>
                            </div>
                            {/* Separador */}
                            <hr className="my-3" />
                            {/* Ritmo Cardiaco */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[9]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeCardiaco}
                                        value={comboboxCardiaco}
                                        disabled={!isCardiacoManual}
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
                                        className="form-control text-center"
                                        value={cardiaco}
                                        onChange={validateNumberCardiaco}
                                        disabled={!isCardiacoManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[8]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{cardiacoError}</div>
                                </div>
                            </div>
                            {/* Separador */}
                            <hr className="my-3" />
                            {/* Clima */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[10]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeClima}
                                        value={comboboxClima}
                                        disabled={!isClimaManual}
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
                                        className="form-control text-center"
                                        value={clima}
                                        onChange={validateNumberClima}
                                        disabled={!isClimaManual}
                                    />
                                </div>
                                <div className="col-1"></div>
                                <div className="col-3">
                                    <div className="text-danger small">{climaError}</div>
                                </div>
                            </div>
                            {/* Visibilidad */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[11]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangeVisibilidad}
                                        value={comboboxVisibilidad}
                                        disabled={!isVisibilidadManual}
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
                                        className="form-control text-center"
                                        value={visibilidad}
                                        onChange={validateNumberVisibilidad}
                                        disabled={!isVisibilidadManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[7]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{visibilidadError}</div>
                                </div>
                            </div>
                            {/* Precipitación */}
                            <div className="row align-items-center mb-3">
                                <div className="col-3 text-start">
                                    <label className="form-label">{comboLabels[12]}:</label>
                                </div>
                                <div className="col-5 d-flex justify-content-center">
                                    <select
                                        className="form-select text-center"
                                        onChange={handleComboboxChangePrecipitacion}
                                        value={comboboxPrecipitacion}
                                        disabled={!isPrecipitacionManual}
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
                                        className="form-control text-center"
                                        value={precipitacion}
                                        onChange={validateNumberPrecipitacion}
                                        disabled={!isPrecipitacionManual}
                                    />
                                </div>
                                <div className="col-1">
                                    <span className="form-text">{comboLabelsFinal[9]}</span>
                                </div>
                                <div className="col-3">
                                    <div className="text-danger small">{precipitacionError}</div>
                                </div>
                            </div>
                            {/* Separador */}
                            <hr className="my-3" />
                        </div>
                    </form>
                    {/* reCAPTCHA */}
                    <div className="my-4">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LfwVXYqAAAAAKB9S1HkKwMmBp1cisyFWveXg_s9"
                            onChange={handleCaptchaChange}
                        />
                        {mostrarEtiqueta && (
                            <div className="text-danger mt-2">
                                Ingresar valores para todos los campos y realiza el reCAPTCHA para realizar la consulta
                            </div>
                        )}
                    </div>
                    {/* Botones */}
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" type="button" onClick={handleCalculateClick}>Calcular</button>
                        <button className="btn btn-secondary" type="button" onClick={handleDeleteClick}>Borrar</button>
                    </div>
                </div>
                {/* Mapa y resultados */}
                <div className="col-lg-6 col-md-12 d-flex flex-column" >
                    <div className="mb-4 flex-grow-1 d-flex">
                        <div id="map" className="w-100 h-50 border border-2 border-secondary rounded" style={{ flex: 1 }}></div>
                    </div>
                    <div className="text-center">
                        <div className="h5 fw-bold my-3">Nivel de riesgo:</div>
                        <div
                            className={`p-3 rounded fw-bold fs-4 ${color === 'green' ? 'bg-success' : color === 'yellow' ? 'bg-warning' : color === 'orange' ? 'bg-orange' : color === 'red' ? 'bg-danger' : ''}`}
                        >
                            {cargando ? 'Calculando...' : resultado}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;