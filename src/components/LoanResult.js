import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SummaryReport from './SummaryReport';
import {Card, Button} from 'react-native-elements';
import ComparisonTable from './Comparison';
import LoanDetail from './LoanDetails';

const LoanResult = props => {
  const {total, loanSummary, totalWithoutPrepayment} = props.loanInfo;
  const comparisonMessage =
    'A comparison for loan payment. Along with monthly EMI if you pay additional payment then it will show how long will it take to completely pay off the loan.';

  return (
    <View>
      <Card title="Summary">
        <SummaryReport data={total} />
        <Button
          title="Compare"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          onPress={props.onCompareClick}
        />
        <Text style={styles.compareText}>{comparisonMessage}</Text>
      </Card>
      <Card title="Comparison For Additional Payment">
          <ComparisonTable loanInfo={props.comparison} />
      </Card>
      <Card title="Principal/Interest Distribution Each Year">
        <LoanDetail loanInfo={loanSummary} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 0,
    padding: 10,
    marginBottom:10
  },
  buttonTitle: {
    fontSize: 20,
  },
  compareText: {
    backgroundColor: '#fff9c4',
    borderRadius: 10,
    padding: 10,
    fontSize:15,
    textAlign:'center'
},
});

export default LoanResult;