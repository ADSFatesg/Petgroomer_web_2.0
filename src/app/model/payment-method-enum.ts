export enum PaymentMethodEnum {
    DINHEIRO = 'DINHEIRO',
    CARTAO_CREDITO = 'CARTAO_CREDITO',
    CARTAO_DEBITO = 'CARTAO_DEBITO',
    TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
    PIX = 'PIX',
    BOLETO_BANCARIO = 'BOLETO_BANCARIO'
  }
  
  export const PaymentMethodOptions = [
    { value: PaymentMethodEnum.DINHEIRO, viewValue: 'Dinheiro' },
    { value: PaymentMethodEnum.CARTAO_CREDITO, viewValue: 'Cartão de Crédito' },
    { value: PaymentMethodEnum.CARTAO_DEBITO, viewValue: 'Cartão de Débito' },
    { value: PaymentMethodEnum.TRANSFERENCIA_BANCARIA, viewValue: 'Transferência Bancária' },
    { value: PaymentMethodEnum.PIX, viewValue: 'Pix' },
    { value: PaymentMethodEnum.BOLETO_BANCARIO, viewValue: 'Boleto Bancário' }
  ];
  