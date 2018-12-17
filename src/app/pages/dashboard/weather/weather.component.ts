import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../../@core/data/weather.service';
// import { ToasterService } from 'angular2-toaster';
import { Location } from './location';
import { Weather, Forecast } from './weather';
import { ForecastDay } from './forecast-day';
import * as moment from 'moment';

@Component({
  selector: 'ngx-weather',
  styleUrls: ['./weather.component.scss'],
  templateUrl: './weather.component.html',
})
export class WeatherComponent implements OnInit {
  location: Location = { city: 'Edinburgh', country: 'uk'};

  weather: Weather;
  forcast: Forecast;
  dateCaption = moment().format('ddd Do MMM');

  constructor(
    private weatherService: WeatherService,
    // private toast: ToasterService
  ) {}

  ngOnInit(): void {
    this.weatherService.getCurrent(this.location).subscribe(
      weather => {
        this.weather = this.mapWeather(weather);
        // console.log(weather);
      },
      error => {
        // this.toast.addToast(error, 'Problem getting the weather.');
        this.weather = undefined;
      }
    );
    this.weatherService.getForcast(this.location).subscribe(
      weather => {
        this.forcast = this.mapForecast(weather);
        // console.log(weather);
      },
      error => {
        // this.toast.addToast(error, 'Problem getting the weather.');
        this.forcast = undefined;
      }
    );
  }


  mapWeather(weatherDto): Weather {
    return {
      city: {
        name: weatherDto.name,
        population: 0
      },
      day: 'mon',
      temp: weatherDto.main.temp,
      min: weatherDto.main.temp_min,
      max: weatherDto.main.temp_max,
      humidity: weatherDto.main.humidity
    };
  }

  mapForecast(forecastDto): Forecast {
    return {
      city: {
        name: forecastDto.city.name,
        population: forecastDto.city.population
      },
      days: this.mapToDays(forecastDto).slice(0, 4)
    };
  }

  mapToDays(weatherDto) {
    const days: ForecastDay[] = [];
    let currentDOY = -1;
    let day: ForecastDay = null;
    weatherDto.list.forEach(element => {
      const mom = moment(element.dt * 1000);
      const dayOfYear = mom.dayOfYear();
      if (dayOfYear !== currentDOY) {
        day = null;
        currentDOY = dayOfYear;
      }

      if (day === null) {
        day = {
          name: mom.format('dddd'),
          min: element.main.temp,
          max: element.main.temp,
          description: element.weather[0].description,
          icon: element.weather[0].icon
        };
        days.push(day);
      } else {
        if (element.main.temp < day.min) {
          day.min = element.main.temp;
        }

        if (element.main.temp > day.max) {
          day.max = element.main.temp;
          day.description = element.weather[0].description;
          day.icon = element.weather[0].icon;
        }
      }
    });
    return days;
  }
}
