import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Alert,
  Dimensions
} from 'react-native';

import { calcHomeLoan, calculateEMI, getSummary, getTotal } from '../shared/calculate-service';
import { convertToLongNumber, getCompletionDate } from '../shared/utilities';

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AppBar from './Header';
import LoanForm from './LoanForm';
import LoanResult from './LoanResult';
import Sidebar from '../components/Sidebar';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [loanInfo, setLoanInfo] = useState(null);
  const [calculatedLoanInfo, setLoanCalculation] = useState(null);
  const [loanComparisonInfo, setLoanComparison] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const resultView = useRef(null);

  const onFormSubmit = loanDetails => {
    calculateHomeLoan(loanDetails);
  };

  useEffect(() => {
    if (calculatedLoanInfo && resultView) {
      resultView.current.scrollTo({ y: 610, animated: true })
    }
  }, [calculatedLoanInfo]);

  const calculateHomeLoan = loanDetails => {
    var loanInfo = convertToLongNumber(loanDetails);
    if (loanDetails.calculateEMI) {
      loanInfo.emi = calculateEMI(
        loanInfo.loanAmount,
        loanInfo.interestRate,
        loanInfo.loanTenure * 12,
      );
    }
    setLoanInfo(loanInfo);
    const { loanAmount, emi, interestRate, prePayment } = loanInfo;
    const loanDetail = calcHomeLoan(loanAmount, emi, interestRate, prePayment);
    const loanSummary = getSummary(loanDetail, 'year');

    var loanSummaryWithoutPrepayment = null;
    var totalWithoutPrepayment = null;
    if (prePayment > 0) {
      const loanDetailWithoutPrepayment = calcHomeLoan(
        loanAmount,
        emi,
        interestRate,
        0,
      );
      loanSummaryWithoutPrepayment = getSummary(
        loanDetailWithoutPrepayment,
        'year',
      );
      totalWithoutPrepayment = getTotal(loanSummaryWithoutPrepayment);
      totalWithoutPrepayment.completionDate = getCompletionDate(
        loanDetailWithoutPrepayment,
      );
    }

    var total = getTotal([...loanSummary], loanInfo.loanAmount);
    if (total) {
      total.completionDate = getCompletionDate(loanDetail);
      total.emi = loanInfo.emi.roundOf(0);
    }

    setLoanCalculation({
      total: total,
      loanSummary: loanSummary,
      totalWithoutPrepayment: totalWithoutPrepayment,
    });
  };

  const loanComparison = () => {
    var comparisons = [10, 30, 50];
    var loanComparison = [];
    const { loanAmount, emi, interestRate } = loanInfo;
    comparisons.map(compare => {
      const prePayment = (compare / 100) * emi;
      const loanDetail = calcHomeLoan(
        loanAmount,
        emi,
        interestRate,
        prePayment,
      );
      var total = getTotal([...loanDetail], loanAmount);
      loanComparison.push({
        completionDate: getCompletionDate(loanDetail),
        totalInterest: total.interest,
        totalAmount: total.total,
        prePayment: prePayment.roundOf(0),
      });
    });
    setLoanComparison(loanComparison);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <>
      <SafeAreaView style={styles.root}>
        <ScrollView
          ref={resultView}
          contentInsetAdjustmentBehavior="automatic">
          <AppBar onHamburgerClick={toggleSidebar} />
          <LoanForm onFormSubmit={onFormSubmit} />
          {calculatedLoanInfo ? (
            <LoanResult
              loanInfo={calculatedLoanInfo}
              comparison={loanComparisonInfo}
              onCompareClick={loanComparison}
            />
          ) : null}
        </ScrollView>
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor:'#f9fcef'
  },
});
export default App;
