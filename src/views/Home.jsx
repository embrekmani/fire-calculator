import React from "react";

import { 
    Container, 
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Button
} from "reactstrap";

import '../assets/scss/Home.scss';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                savings: {
                    value: 0,
                    valid: false,
                },
                netWorth: {
                    value: 0,
                    valid: false,
                },
                interest: {
                    value: 0,
                    valid: false,
                },
                withdrawal: {
                    value: 0,
                    valid: false,
                },
                spending: {
                    value: 0,
                    valid: false,
                },
                income: {
                    value: 0,
                    valid: false,
                },
                incomeTax: {
                    value: 0,
                    valid: false,
                },
                returnTax: {
                    value: 0,
                    valid: false,
                },
            },
            allFieldsValid: false,
            hasCalculated: false,

            yearsToRetirement: null,
            totalSavingsRequired: null,
        };
    }
    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
    }

    areAllValid() {
        for (let field in this.state.form) {
            if (this.state.form[field].valid === false) {
                return false;
            }
        }
        return true;
    }

    handleChange(field, e) {
        let value = e.target.value;
        let form = this.state.form;
        if ((value >= 0 || value < 0) && value.replace(/\s/g, '').length > 0 && value !== '') {
            form[field].value = value;
            form[field].valid = true;
        }
        else {
            form[field].valid = false;
        }
        this.setState({
            form,
            allFieldsValid: this.areAllValid(),
        });
        console.log(this.state.form[field].value)
    }

    calculate() {
        // x = retirement spending - (retirement income - tax)
        // total needed to retire = ((x * 100) / withdrawal rate) + tax on returns
        // while total savings is less than required amount -> add (savings * 12) + interest
        let form = this.state.form
        let requiredMonthlyIncome = form.spending.value - (form.income.value - (form.income.value * (form.incomeTax.value / 100)));
        let totalNeeded = (((requiredMonthlyIncome * 12) * 100) / form.withdrawal.value) * ((form.returnTax.value / 100) + 1);
        let yearsToRetirement = 0;
        let totalSavings = Number(form.netWorth.value);
        let annualSavings = Number(form.savings.value * 12);
        while (totalSavings < totalNeeded) {
            console.log(totalSavings, annualSavings, (totalSavings + annualSavings) * (Number(form.interest.value) / 100), (form.interest.value / 100))
            totalSavings += annualSavings + ((totalSavings + annualSavings) * (Number(form.interest.value) / 100))
            yearsToRetirement++;
        }
        this.setState({
            yearsToRetirement,
            totalSavingsRequired: totalNeeded,
            hasCalculated: true,
        });
    }

    render() {
        return (
            <>
                <main ref="main">
                    <section className="section">
                        <Container>
                            <h1>FI/RE Calculator <span className="beta">Beta</span></h1>
                            <p>Financial Independence / Retire Early</p>
                            <Form>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label>Savings (after tax)</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>$</InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    className="form-control-alternative"
                                                    type="text"
                                                    onChange={this.handleChange.bind(this, 'savings')}
                                                    name="savings"
                                                />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>/m</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Current net worth (+/-)</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className="form-control-alternative"
                                                type="text"
                                                onChange={this.handleChange.bind(this, 'netWorth')}
                                                name="netWorth"
                                            />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Interest rate</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>%</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className="form-control-alternative"
                                                type="text"
                                                onChange={this.handleChange.bind(this, 'interest')}
                                                name="interest"
                                            />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Withdrawal rate</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>%</InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    className="form-control-alternative"
                                                    type="text"
                                                    onChange={this.handleChange.bind(this, 'withdrawal')}
                                                    name="withdrawal"
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label>Expected retirement spending</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className="form-control-alternative"
                                                type="text"
                                                onChange={this.handleChange.bind(this, 'spending')}
                                                name="spending"
                                            />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText>/m</InputGroupText>
                                            </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Expected retirement income (side jobs, passive income, etc.)</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className="form-control-alternative"
                                                type="text"
                                                onChange={this.handleChange.bind(this, 'income')}
                                                name="income"
                                            />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText>/m</InputGroupText>
                                            </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Tax rate on retirement income</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>%</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className="form-control-alternative"
                                                type="text"
                                                onChange={this.handleChange.bind(this, 'incomeTax')}
                                                name="incomeTax"
                                            />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Tax rate on returns</Label>
                                            <InputGroup className="input-group-alternative mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>%</InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                className="form-control-alternative"
                                                type="text"
                                                onChange={this.handleChange.bind(this, 'returnTax')}
                                                name="returnTax"
                                            />
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <a href="#output">
                                    <Button block color="primary" disabled={!this.state.allFieldsValid} size="lg" type="button" onClick={this.calculate.bind(this)}>
                                        Calculate
                                    </Button>
                                </a>
                            </Form>
                            <div id="output" className={"output " + (this.state.hasCalculated ? 'show' : 'hidden')}>
                                <h3>Years to retirement: </h3>
                                <p>{this.state.yearsToRetirement}</p>
                                <h3>Required savings: </h3>
                                <p>${this.state.totalSavingsRequired}</p>
                            </div>
                        </Container>
                    </section>
                </main>
            </>
        );
  }
}

export default Home;
