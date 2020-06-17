import { Component, ViewChild, ElementRef, OnInit, AfterViewChecked } from '@angular/core';

interface InterestCalculatorData {
  type: Purpose;
  amount: number;
  duration: number; // in months
  rate: number; // in %
  frequency: Frequency;
}

interface Message {
  body: string;
  isUser: boolean;
}

enum Purpose {
  Invest = 'invest',
  Save = 'save'
}

enum Frequency {
  Monthly = 'monthly',
  Annually = 'annually'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  isCalculating = false;
  @ViewChild('messageContainer', { static: false }) messageContainer: ElementRef;

  // define form defaults
  public data: InterestCalculatorData = {
    type: Purpose.Save,
    amount: 0,
    duration: 6,
    rate: 0,
    frequency: Frequency.Monthly
  };

  public messages: Message[] = [];

  ngOnInit(): void {
    setTimeout(() =>
      this.showMessage('Hi, welcome to your very own interest calculator :)<br><br>Use the fields below to get started.', false)
      , 2000);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public handleCalculate() {
    this.isCalculating = true;
    const userBody = this.buildUserMessage(this.data);
    this.showMessage(userBody, true);
    const amount = this.calculateSimpleInterest(this.data);
    const responseBody = this.buildPiggyMessage(this.data.duration, amount);
    setTimeout(() => {
      this.showMessage(responseBody, false);
      this.isCalculating = false;
    }, 2000);
  }

  private calculateSimpleInterest({ amount, duration, rate, frequency }: InterestCalculatorData) {
    const interest = (rate / 100) * amount;
    const periodInterest = frequency === Frequency.Monthly ? interest * duration : interest * (duration / 12);
    return periodInterest + Number(amount);
  }

  private buildPiggyMessage(duration: number, amount: number) {
    return `In <strong>${duration}</strong> month${duration > 1 ? 's' : ''}, you will have <strong>NGN ${amount}</strong>`;
  }

  private buildUserMessage({ amount, duration, rate, frequency, type }: InterestCalculatorData) {
    return `I want to ${type} NGN ${amount} for ${duration} month${duration > 1 ? 's' : ''} at a rate of ${rate}% ${frequency}`;
  }

  private showMessage(body: string, isUser: boolean) {
    this.messages.push({ body, isUser });
    return this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }
}
