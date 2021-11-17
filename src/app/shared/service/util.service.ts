import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {}

  orderByKeyUp(dataList: any[], key: string) {
    if (dataList && dataList.length > 0) {
      let i = 0;
      let temp: any;
      while (i < dataList.length) {
        for (let j = i + 1; j < dataList.length; j++) {
          if (dataList[i][key] < dataList[j][key]) {
            temp = dataList[j];
            dataList[j] = dataList[i];
            dataList[i] = temp;
          }
        }
        i++;
      }
    } else {
      return [];
    }
    return dataList;
  }

  orderByKeyDown(dataList: any[], key: string) {
    if (dataList && dataList.length > 0) {
      let i = 0;
      let temp: any;
      while (i < dataList.length) {
        for (let j = i + 1; j < dataList.length; j++) {
          if (dataList[i][key] >= dataList[j][key]) {
            temp = dataList[j];
            dataList[j] = dataList[i];
            dataList[i] = temp;
          }
        }
        i++;
      }
    } else {
      return [];
    }
    return dataList;
  }

  orderByObjetKeyUp(dataList: any[],objet: string, key: string) {
    if (dataList && dataList.length > 0) {
      let i = 0;
      let temp: any;
      while (i < dataList.length) {
        for (let j = i + 1; j < dataList.length; j++) {
          if (dataList[i][objet][key] < dataList[j][objet][key]) {
            temp = dataList[j];
            dataList[j] = dataList[i];
            dataList[i] = temp;
          }
        }
        i++;
      }
    } else {
      return [];
    }
    return dataList;
  }

  orderByObjetKeyDown(dataList: any[],objet: string, key: string) {
    if (dataList && dataList.length > 0) {
      let i = 0;
      let temp: any;
      while (i < dataList.length) {
        for (let j = i + 1; j < dataList.length; j++) {
          if (dataList[i][objet][key] >= dataList[j][objet][key]) {
            temp = dataList[j];
            dataList[j] = dataList[i];
            dataList[i] = temp;
          }
        }
        i++;
      }
    } else {
      return [];
    }
    return dataList;
  }

  orderByKeyUpTime(dataList: any[], key: string) {
    if (dataList && dataList.length > 0) {
      let i = 0;
      let temp: any;
      while (i < dataList.length) {
        for (let j = i + 1; j < dataList.length; j++) {
          if (dataList[i][key][0] && (dataList[i][key][0].heures < dataList[j][key][0].heures)) {
            temp = dataList[j];
            dataList[j] = dataList[i];
            dataList[i] = temp;
          }
        }
        i++;
      }
    } else {
      return [];
    }
    return dataList;
  }

  occurenceOfId(dataList: any[], key: string, id: number) {
    let occur = 0;
    let i = 0;
    while (i < dataList.length) {
      if (dataList[i][key] === id) {
        occur++;
      }
      i++;
    }
    return occur;
  }

  occurenceIndex(dataList: any[], key: string, id: number) {
    let indexList = [];
    let i = 0;
    while (i < dataList.length) {
      if (dataList[i][key] === id) {
        indexList.push(i);
      }
      i++;
    }
    return indexList;
  }

  removeIdOccurence(dataList: any[], key: string, id: number) {
    let i = 0;
    let found = false;
    while (i < dataList.length && !found) {
      if (dataList[i][key] === id) {
        dataList.splice(i, 1);
        found = true;
      }
      i++;
    }
    return dataList;
  }

  occurenceMax(dataList: any[]) {
    let max = dataList[0];
    let i = 0;
    for (let j = i + 1; j < dataList.length; j++) {
      if (max < dataList[j]) {
        max = dataList[j];
      }
    }
    return max;
  }


  // Format an array to matrix and can be used for pagination
  formatArrayToMatrix(arraydata: any[], nbElements: number) {
    const nbres = arraydata.length;
    const nbIter = Math.ceil(nbres / nbElements);
    const matrix = [];
    let subMatrix = [];
    let index = 0;
    let j = 0;
    while (index < nbIter) {
      subMatrix = [], j = 0;
      while (j < nbElements) {
        if (index * nbElements + j < nbres) {
          subMatrix.push(arraydata[index * nbElements + j]);
        }
        j++;
      }
      if (subMatrix.length > 0) {
        matrix.push(subMatrix);
      }
      index++;
    }
    return matrix;
  }


}
