import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface FeedbackMessage {
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-feedback-message',
  templateUrl: './feedback-message.component.html',
  styleUrl: './feedback-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackMessageComponent {
  readonly state = input<FeedbackMessage | null>(null);
}
