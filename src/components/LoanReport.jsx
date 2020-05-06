import React, { useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {calcHomeLoan,generateSummary,groupBy} from '../shared/calculate-service';
import Grid from '@material-ui/core/Grid';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
    Line, LineChart, Legend, ResponsiveContainer, PieChart, Pie, Bar,
    BarChart, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart,
    RadialBarChart, RadialBar, Treemap } from 'recharts';
  
const useStyles = makeStyles({
    gridContainer: {
		marginTop: 25
	},
	formContainer: {
//		background: '#f7f7eb',
//		margin: '25px auto',
		borderRadius: 4,
		border: 'solid 1px #e0e0e0',
		padding: 12,
		boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
    },
    detail: {
        maxHeight: '80vh',
    },
    summery: {
        maxHeight: '40vh',
        marginBottom:25
    },
    chart: {
        height:'50vh'
    }
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#2280a0',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor:  theme.palette.action.hover,
        },
    },
}))(TableRow);

const LoanResult =(props)=>{
    const classes = useStyles();
    const { loanAmount,emi,interestRate,prePayment } = parseQueryStringToObject(window.location.search)
    const loanDetail = calcHomeLoan(loanAmount, emi, interestRate, prePayment);
    const loanSummary = generateSummary(loanDetail,"year");

    const renderColorfulLegendText = (value, entry) => {
        const { color } = entry.payload;
      
      return <span style={{ color }}>{value}</span>;
    }

    return (
        <Grid container spacing={0} className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.formContainer}>
                <TableContainer className={classes.summery}>
                    <Table stickyHeader  aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Year</StyledTableCell>
                                <StyledTableCell align="right">Principal</StyledTableCell>
                                <StyledTableCell align="right">Interest</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loanSummary && loanSummary.map(row => (
                                <StyledTableRow  key={row.monthYear}>
                                    <StyledTableCell  component="th" scope="row">
                                    {row.year}
                                    </StyledTableCell >
                                    <StyledTableCell  align="right">{row.principal.toFixed(2)}</StyledTableCell >
                                    <StyledTableCell  align="right">{row.interest.toFixed(2)}</StyledTableCell >
                                </StyledTableRow >
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer className={classes.detail}>
                    <Table stickyHeader  aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Month - Year</StyledTableCell>
                                <StyledTableCell align="right">Principal</StyledTableCell>
                                <StyledTableCell align="right">Interest</StyledTableCell>
                                <StyledTableCell align="right">Balance</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loanDetail && loanDetail.map(row => (
                                <StyledTableRow  key={row.monthYear}>
                                    <StyledTableCell  component="th" scope="row">
                                        {row.month} - {row.year}
                                    </StyledTableCell >
                                    <StyledTableCell  align="right">{row.principal.toFixed(2)}</StyledTableCell >
                                    <StyledTableCell  align="right">{row.interest.toFixed(2)}</StyledTableCell >
                                    <StyledTableCell  align="right">{row.balance.toFixed(2)}</StyledTableCell >
                                </StyledTableRow >
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid xs={12} md={6}>
                <div className={classes.chart}>
                    <ResponsiveContainer>
                    <BarChart width={730} height={250} data={loanSummary}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            {/* <YAxis yAxisId="a" /> */}
                            {/* <YAxis yAxisId="b" orientation="right" /> */}
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="a" dataKey="principal" fill="#8884d8" />
                            <Bar yAxisId="b" dataKey="interest" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer>
                        <LineChart
                            width={500}
                            height={300}
                            data={loanSummary}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="principal" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="interest" stroke="#82ca9d" strokeWidth={2}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Grid>
        </Grid>
    )
}

export default LoanResult;


const parseQueryStringToObject = (queryString)=>{
    var obj = {};
    if (queryString) {
        var keys = queryString.replace('?', '').split('&');
        if (keys && keys.length > 0) {
            keys.map(a => {
                var keyVal = a.split('=');
                if (keyVal && keyVal.length > 0) {
                    obj[keyVal[0]] = keyVal[1];
                }
            })
        }
    }
    return obj;
}
