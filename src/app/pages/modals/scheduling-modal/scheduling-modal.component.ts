import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethodEnum } from '../../../model/payment-method-enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchedulingService } from '../../../service/scheduling.service';
import { SchedulingRetrieve } from '../../../model/scheduling';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scheduling-modal',
  templateUrl: './scheduling-modal.component.html',
  styleUrl: './scheduling-modal.component.scss'
})
export class SchedulingModalComponent {
  paymentForm: FormGroup;
  paymentMethods = Object.values(PaymentMethodEnum); 

  constructor(
    private dialogRef: MatDialogRef<SchedulingModalComponent>,
    private schedulingService: SchedulingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { scheduling: SchedulingRetrieve }
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: [data.scheduling.paymentMethod || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.paymentForm.valid) {
      this.schedulingService.updateMethodPayment(this.data.scheduling.id, this.paymentForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Método de pagamento atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-success']
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Erro ao atualizar o método de pagamento.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
          console.error('Erro ao atualizar o pagamento:', error);
        }
      });
    } else {
      this.snackBar.open('Selecione um método de pagamento válido.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}