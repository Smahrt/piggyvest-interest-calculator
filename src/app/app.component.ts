import { Component, ViewChild, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { Icons } from './app.constants';

interface InterestCalculatorData {
  amount: number;
  duration: number; // in months
  plan: PiggyPlan;
}

interface Message {
  body: string;
  isUser: boolean;
}

interface PiggyPlan { name: string; rate: number | number[]; icon: string; selected?: boolean; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCalculating = false;
  @ViewChild('messageContainer', { static: false }) messageContainer: ElementRef;

  public piggyPlans: PiggyPlan[] = [
    {
      name: 'PiggyBank',
      rate: 10,
      icon: Icons.PIGGYBANK,
      selected: true
    }, {
      name: 'SafeLock',
      rate: [6, 8, 10, 13, 31],
      icon: Icons.SAFELOCK,
      selected: false
    }, {
      name: 'Targets',
      rate: 10,
      icon: Icons.TARGETS,
      selected: false
    }, {
      name: 'Flex Naira',
      rate: 10,
      icon: Icons.FLEXNAIRA,
      selected: false
    }
  ];

  // define form defaults
  public data: InterestCalculatorData = {
    amount: 0,
    duration: 6,
    plan: {
      name: 'PiggyBank',
      rate: 10,
      icon: Icons.PIGGYBANK,
      selected: true
    }
  };

  public message = '';

  ngOnInit(): void {
  }

  public selectPlan(plan: PiggyPlan) {
    const index = this.piggyPlans.findIndex(p => p.name === plan.name);
    this.piggyPlans.forEach(p => {
      if (p.selected) {
        p.selected = false;
      }
    });
    this.piggyPlans[index].selected = true;
  }

  public handleCalculate() {
    this.isCalculating = true;
    this.data.plan = this.piggyPlans.find(p => p.selected);
    const amount = this.calculateSimpleInterest(this.data);
    this.showPiggyMessage(this.data.duration, amount);
    this.isCalculating = false;
  }

  private calculateSimpleInterest({ amount, duration, plan }: InterestCalculatorData) {
    const interest = typeof plan.rate === 'number' ? (plan.rate / 100) * amount
      : duration < 4
        ? (plan.rate[duration - 1] / 100) * amount
        : duration > 3 && duration < 24
          ? (plan.rate[3] / 100) * amount
          : (plan.rate[4] / 100) * amount;
    const periodInterest = interest * (duration / 12);
    return (periodInterest + Number(amount)).toFixed(2);
  }

  private showPiggyMessage(duration: number, amount: number) {
    return this.message = `In ${duration} month${duration > 1 ? 's' : ''}, you will have NGN ${amount}`;
  }
}
