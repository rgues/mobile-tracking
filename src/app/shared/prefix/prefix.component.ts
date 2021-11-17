import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from 'src/app/shared/service/location.service';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-prefix',
  templateUrl: './prefix.component.html',
  styleUrls: ['./prefix.component.scss'],
})
export class PrefixComponent implements OnInit {

  loading: boolean;
  filterData: any[];
  states: any[];
  filter: boolean;
  allData: any[];
  nbItems: number;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  constructor(
    private location: LocationService,
    private util: UtilService,
    private modal: ModalController,
  ) {
    this.filterData = [];
    this.states = [];
    this.loading = false;
    this.filter = false;
    this.allData = [];
    this.nbItems = 15;
  }

  ngOnInit() {
    this.getWordCountries(null);
  }

  // Filter the list of tontines
  searchForInvitation(ev: any) {
    this.infiniteScroll.disabled = false;
    this.filter = true;
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.allData = this.filterData.filter((country) => {
        return (country.callingCodes[0].toLowerCase().indexOf(val.toLowerCase()) > -1) || (country.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      if (this.allData.length > this.nbItems) {
        for (let i = 0; i < this.nbItems; i++) {
          this.states.push(this.allData[this.states.length]);
        }
      } else {
        this.states = this.allData;
      }
    } else {
      this.states = this.filterData;
    }
  }

  // Get all the word countries
  getWordCountries(event) {
    this.loading = true;
    this.location.getAllcountriesData().subscribe((countries: any) => {

      console.log(countries);
      this.loading = false;
      if (countries && countries.length > 0) {
        const states = this.util.orderByKeyDown(countries, 'name');
        this.allData = states;
        this.filterData = states;
        if (this.allData.length > this.nbItems) {
          for (let i = 0; i < this.nbItems; i++) {
            this.states.push(this.allData[this.states.length]);
          }
        } else {
          this.states = this.allData;
        }
      }

      if (event) {
        setTimeout(() => {
          event.target.complete();
        }, 200);
      }

    });
  }

  // Refresh the list
  refreSher(event) {
    this.infiniteScroll.disabled = false;
    this.getWordCountries(event);
  }

  // Infinite scroll data
  infinteScrollData(event) {
    setTimeout(() => {
      for (let i = 0; i < this.nbItems; i++) {
        if (this.states.length < this.allData.length) {
          this.states.push(this.allData[this.states.length]);
        } else if (this.states.length === this.allData.length) {
          event.target.disabled = true;
        }
      }
      event.target.complete();
    }, 2000);
  }

  // select a country
  selectCountry(event) {
    this.modal.dismiss(event.detail.value, 'select');
  }

  // close modal
  closeCountries() {
    this.modal.dismiss(null, 'cancel');
  }


}
