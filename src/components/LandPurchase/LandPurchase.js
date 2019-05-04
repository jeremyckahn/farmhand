import React, { Component } from 'react';
import FarmhandContext from '../../Farmhand.context';
import { func, number } from 'prop-types';
import { PURCHASEABLE_FIELD_SIZES } from '../../constants';
import './LandPurchase.sass';

export class LandPurchase extends Component {
  state = {
    selectedOption: '',
  };

  purchaseableFieldSizes = [...PURCHASEABLE_FIELD_SIZES.entries()];

  get selectedOption() {
    return Number(this.state.selectedOption);
  }

  get canPlayerBuySelectedOption() {
    const {
      props: { money },
    } = this;

    const selectedOptionNumber = this.selectedOption;
    const selectedField = PURCHASEABLE_FIELD_SIZES.get(selectedOptionNumber);

    return (
      !!selectedField &&
      !this.hasPurchasedField(selectedOptionNumber) &&
      money >= selectedField.price
    );
  }

  hasPurchasedField = fieldId => fieldId <= this.props.purchasedField;

  handleFieldPurchase = () => {
    const selectedOptionNumber = this.selectedOption;
    const { price } = PURCHASEABLE_FIELD_SIZES.get(selectedOptionNumber);
    const { handleFieldPurchase, money } = this.props;

    if (money >= price) {
      handleFieldPurchase(selectedOptionNumber);
    }
  };

  onSelectChange = ({ target: { value } }) => {
    this.setState({ selectedOption: value });
  };

  updateSelectedOption = () => {
    const {
      props: { money },
      selectedOption,
    } = this;

    const nextOptionId = selectedOption + 1;
    const nextFieldToPurchase = PURCHASEABLE_FIELD_SIZES.get(nextOptionId);

    if (nextFieldToPurchase && money >= nextFieldToPurchase.price) {
      this.setState({ selectedOption: String(nextOptionId) });
    }
  };

  componentDidMount() {
    this.updateSelectedOption();
  }

  componentDidUpdate(prevProps) {
    if (this.props.money !== prevProps.money) {
      this.updateSelectedOption();
    }
  }

  render() {
    const {
      canPlayerBuySelectedOption,
      handleFieldPurchase,
      hasPurchasedField,
      onSelectChange,
      props: { money },
      purchaseableFieldSizes,
      state: { selectedOption },
    } = this;

    return (
      <div className="LandPurchase">
        <h2>Expand field</h2>
        <select onChange={onSelectChange} value={selectedOption}>
          {purchaseableFieldSizes.map(([id, { price, columns, rows }]) => (
            <option
              key={id}
              value={id}
              disabled={money < price || hasPurchasedField(id)}
            >
              ${price}: {columns} x {rows}
            </option>
          ))}
        </select>
        <button
          onClick={handleFieldPurchase}
          disabled={!canPlayerBuySelectedOption}
        >
          Buy
        </button>
      </div>
    );
  }
}

LandPurchase.propTypes = {
  handleFieldPurchase: func.isRequired,
  money: number.isRequired,
  purchasedField: number.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <LandPurchase {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
