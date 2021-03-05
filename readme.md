# Coronavirus 2019 EC Mapa

Ejercicio realizado para mostrar un mapa actualizado de las personas afectadas por el coronavirus a nivel de mi Pais Ecuador, usando herramientas como:
- Leaflet 
- Leaflet FullScreen
- Leaflet Edgebuffer

## Actividades

**#1)** Consultar el API de "coronavirusEc".

**#2)** Crear el mapa con Leaflet.

**#3)** Crear los marcadores con los datos de cada provincia.

**#4)** Crear los gráficos donde se muestran los datos estadísticos del Covid19.

**#5)** Crear la sección con el resumen de los datos estadísticos del Covid19.

## Como Probarlo

Puedes verlo [aquí](https://coronavirus-ec-sm-2019.netlify.com/) o seguir la guía sobre **Como Utilizarlo**

## ¿Como Utilizarlo?

Puedes bajarte el proyecto y ejecutarlo en un servidor web, si tienes NodeJS puedes instalar el paquete **live-server** y ejecutar el comando
```cmd
live-server
```

## Imágenes

**Versión Móvil**
![Móvil](./MapaCoronavirusMovil.png)

**Versión Web**
![Móvil](./MapaCoronavirusWeb.png)

**Versión Web**

## Inspiración

Este proyecto fue inspirando en un video genial que hizo el docente **Leonidas Esteban** y que me motivo a realizarlo con la librería Leaflet de manera gratuíta
- Pueden ver la clase original [aquí](https://www.youtube.com/watch?v=UlfacaW8634)
- Pueden revisar el API utilizado en el archivo DB.JSON o [aquí](https://my-json-server.typicode.com/StalinMazaEpn/CoronavirusECApi)

## Autor
> Stalin Maza - Desarrollador Web
- Puedes ver mi blog [aquí](https://stalinmaza97.hashnode.dev/)
- Puedes ver mi canal [aquí](https://www.youtube.com/channel/UCMDvFIXXZv5tUXNa7-qF5pw?view_as=subscriber)

## Nota
La obtención de los datos se realiza mediante la consulta a un endpoint construido con scrapping hacia la página oficial del Ministerio de Salud Pública de Ecuador, por lo que la actualización de datos depende de la página oficial, para más información se pueda indagar [aquí](https://www.salud.gob.ec/actualizacion-de-casos-de-coronavirus-en-ecuador/)