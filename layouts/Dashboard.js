import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarChart, ProgressChart } from 'react-native-chart-kit'
import { Row, Rows, Table } from 'react-native-table-component'

import { fetchExpenseData } from '../commonMethods'
import axios from 'axios'
import moment from 'moment'

import bin from '../assets/bin.png'


const Dashboard = () => {

  const { height, width } = useWindowDimensions();

  const [currentDate, setCurrentDate] = useState(new Date())
  const [expensesData, setExpensesData] = useState(null)
  const [expensesDescription, setExpensesDescription] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [progressChartData, setProgressChartData] = useState(null)

  const [tableData, setTableData] = useState([])

  const [fetchingData, setFetchingData] = useState(false)

  useEffect(() => {
    // setExpensesData(fetchExpenseData())
    fetchMonthlyExpenseData()
    // setExpensesData(fetchMonthlyExpenseData())
    // .then((res => console.log(res)))
  }, [])

  useEffect(() => {
  }, [chartData, expensesData])

  const fetchMonthlyExpenseData = async () => {

    setFetchingData(true)
    setExpensesDescription(null)

    const expenseDate = moment(new Date(currentDate)).format('DD-MM-YYYY')

    await axios.get(`https://shimmering-marsh-raisin.glitch.me/getMonthlyExpense/${expenseDate}`)
      .then((res) => {
        setExpensesData(res.data)
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;

        res.data.map(item => {
          if (item.category === 'Social') {
            count4 = count4 + item.price
          }
          else if (item.category === 'Gas') {
            count3 = count3 + item.price
          }
          else if (item.category === 'Utilities') {
            count2 = count2 + item.price
          }
          else if (item.category === 'Groceries') {
            count1 = count1 + item.price
          }
        })
        setChartData(
          {
            labels: ['Groceries', 'Utilities', 'Gas', 'Social'],
            datasets: [
              {
                data: [count1, count2, count3, count4]
              }
            ]
          }
          // [count1, count2, count3, count4]
        )
        buildProgressChartData(res.data)
        buildTableData(res.data)
        setFetchingData(false)

      })
      .catch((error) => {
        console.log(error)
        setFetchingData(false)
      })

  }

  const buildProgressChartData = (data) => {
    let count1 = 0;
    let count2 = 0;


    data.map(item => {
      if (item.category === 'Utilities') {
        count1 = count1 + item.price
      }
      else if (item.category === 'Social') {
        count2 = count2 + item.price
      }

    })

    let utilitiesLimit = 5000
    let socialLimit = 5000;

    setProgressChartData({
      labels: ['Utilities', 'Social'], // optional
      data: [
        (count1 / utilitiesLimit) <= 1 ? (count1 / utilitiesLimit) : 1,
        (count2 / socialLimit) <= 1 ? (count2 / socialLimit) : 1
      ],
      utilities: count1 / utilitiesLimit,
      utilitiesLimit,
      social: count2 / socialLimit,
      socialLimit
    })


  }

  const buildTableData = (data) => {
    let tempData = []
    data.reverse().map((item, index) => {
      tempData.push([
        <Button
          onPress={() => { setExpensesDescription(item) }}
          // color="#00000000"
          title={item.category}
        />,
        // item.category,
        item.dateOfPurchase,
        item.price + '/-',
        <Button
          onPress={() => { deleteAlert(item._id, index) }}
          title="Delete"
          color="#841584"
          accessibilityLabel="Delete this expense"
        />
      ])
    })
    setTableData({
      HeadTable: ['Category', 'Date of Purchase', 'Price', 'Actions'],
      DataTable: tempData
    })
  }

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(71, 71, 226, ${opacity})`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const deleteExpense = async (id, index) => {
    setFetchingData(true)
    await axios.delete(`https://shimmering-marsh-raisin.glitch.me/deleteExpense/${id}`)
      .then((res) => {
        console.log('succefully deleted the expense')
        fetchMonthlyExpenseData()
        setFetchingData(false)
      })
      .catch((error) => {
        console.log(error)
        setFetchingData(false)
      })

  }

  const deleteAlert = (id, index) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        {
          text: 'Delete',
          onPress: () => deleteExpense(id, index),
          style: 'default'
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    )
  }

  useEffect(() => {
    fetchMonthlyExpenseData()
  }, [currentDate])


  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        <Button onPress={() => setCurrentDate(moment(currentDate).subtract(1, 'M'))}
          title="Previous"
        />
        <Text style={styles.headerYear}>{moment(currentDate).format('MMMM YYYY')}</Text>
        <Button onPress={() => setCurrentDate(moment(currentDate).add(1, 'M'))}
          title="Next"
        />
      </View>
      <ScrollView>
      <View style={{ flexDirection: 'column' }}>
        {fetchingData ? <ActivityIndicator size="large" /> : null}
        {chartData ?
          <BarChart
            style={{
              marginVertical: 8,
              borderRadius: 16,
              // margin:20
            }}
            data={chartData}
            width={width}
            height={height / 3}
            yAxisLabel="$"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
          : null}
        {fetchingData ? <ActivityIndicator size="large" /> : null}
        {progressChartData ?
          <ScrollView contentContainerStyle={{ display: 'flex', justifyContent: 'center' }}>
            <ProgressChart
              data={progressChartData}
              width={width}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={true}
            />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ alignSelf: 'center' }}>Utilities: {Math.round(progressChartData.utilities * 100) + '%'}</Text>
              <Text style={{ alignSelf: 'center', marginLeft: 10 }}>Limit : {progressChartData.utilitiesLimit}</Text>
              {progressChartData.utilities > 1 ?
                <Text style={{ color: 'red', marginLeft: 10 }}>crossed</Text> : <Text style={{ color: 'dodgerblue', marginLeft: 10 }}>not crossed</Text>}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ alignSelf: 'center' }}>Social: {Math.round(progressChartData.social * 100) + '%'}</Text>
              <Text style={{ alignSelf: 'center', marginLeft: 10 }}>Limit : {progressChartData.socialLimit}</Text>
              {progressChartData.social > 1 ?
                <Text style={{ color: 'red', marginLeft: 10 }}>crossed</Text> : <Text style={{ color: 'dodgerblue', marginLeft: 10 }}>not crossed</Text>}
            </View>
          </ScrollView>
          : null}
      </View>

      {fetchingData ? <ActivityIndicator size="large" /> : null}
      <View style={{ marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <View>
          <Text style={{ fontSize: 18, fontStyle: 'italic', marginBottom: 10, marginRight: 10 }}>Today's Expenses ({expensesData && expensesData.filter(item => item.dateOfPurchase === moment(new Date()).format('DD-MM-YYYY')).length})</Text>
          <ScrollView style={{ maxHeight: 100 }}>
            {expensesData && expensesData.filter(item => item.dateOfPurchase === moment(new Date()).format('DD-MM-YYYY')).map(sub_item => {
              return (
                <Text style={{ marginLeft: 10 }}>{sub_item.category} {sub_item.price} /-</Text>
              )
            })}
          </ScrollView>
        </View>
        <View style={{flexShrink: 1}}>
          {fetchingData ? <ActivityIndicator size="large" /> : null}
          {chartData ?
            <>
              <Text style={{ fontSize: 18, fontStyle: 'italic', marginBottom: 5 }}>Total Expenses this month</Text>
              <Text style={styles.TotalExpenses}>Groceries: {chartData.datasets[0].data[0]} /-</Text>
              <Text style={styles.TotalExpenses}>Utilities: {chartData.datasets[0].data[1]} /-</Text>
              <Text style={styles.TotalExpenses}>Gas: {chartData.datasets[0].data[2]} /-</Text>
              <Text style={styles.TotalExpenses}>Social: {chartData.datasets[0].data[3]} /-</Text>
              <Text style={{ ...styles.TotalExpenses, marginTop: 10, fontStyle: 'italic' }}>Total: {Number(chartData.datasets[0].data[0]) +
                Number(chartData.datasets[0].data[1]) +
                Number(chartData.datasets[0].data[2]) +
                Number(chartData.datasets[0].data[3])} /-</Text>
            </>
            : null}
        </View>
      </View>
      </ScrollView>
      {expensesDescription ?
        <View style={{ borderColor: 'orange', borderWidth: 5, borderRadius: 8, padding: 10, marginBottom: 5 }}>
          <Text style={styles.ExpenseDetails}>Category: {expensesDescription.category}</Text>
          <Text style={styles.ExpenseDetails}>Description: {expensesDescription.description}</Text>
          <Text style={styles.ExpenseDetails}>Price: {expensesDescription.price}/-</Text>
          <Text style={styles.ExpenseDetails}>Date of Purchase: {expensesDescription.dateOfPurchase}/-</Text>
        </View>
        : null
      }
      <ScrollView style={{minHeight: height / 2}}>
        {fetchingData ? <ActivityIndicator size="large" /> : null}

        {tableData ?
          <>
            <Text style={{ fontSize: 20, fontStyle: 'italic', marginBottom: 10 }}>This Month's Expense</Text>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
              <Row data={tableData.HeadTable} style={styles.HeadStyle} textStyle={styles.TableText} />
              <Rows data={tableData.DataTable} textStyle={styles.TableText} />
            </Table>
          </>
          : null}
      </ScrollView>
      <View scrollEnabled={true}>

      </View>
    </>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: '#ffffff'
  },
  HeadStyle: {
    height: 50,
    alignContent: "center",
    backgroundColor: '#ffe0f0'
  },
  TableText: {
    margin: 10,
    // overflow: 'auto'
  },
  TotalExpenses: {
    fontSize: 16,
    marginLeft: 10
  },
  ExpenseDetails: {
    fontSize: 16,
    fontStyle: 'italic',
    marginLeft: 10
  },
  headerYear: {
    fontSize: 20,
    fontStyle: 'italic'
  }

})