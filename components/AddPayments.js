import React, { useState } from 'react'
import { Button, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'

import groceries from "../assets/grocery.png";
import shopping from "../assets/shopping.png";
import gas from "../assets/gas.png";
import social from "../assets/social.png";
import { addExpenseToDB } from '../commonMethods';
import moment from 'moment';

const AddPayments = ({ navigation }) => {

    const [price, setPrice] = useState(null)
    const [expenseDetails, setExpenseDetails] = useState(null)
    const [purchaseType, setPurchaseType] = useState("Select a Category");

    const [showError, setShowError] = useState(null)

    const handleSubmit = (event) => {
        event.stopPropagation()
        event.preventDefault()
        if (price && purchaseType !== "Select a Category") {
            addExpenseToDB({
                price,
                category: purchaseType,
                description: expenseDetails ? expenseDetails : '',
                dateOfPurchase: moment(new Date()).format('DD-MM-YYYY'),
                month: new Date().getMonth() < 10 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1),
                year: new Date().getFullYear()
            })
            setPrice(null)
            setPurchaseType("Select a Category")
            setExpenseDetails(null)
            setShowError(null)
        } else {
            setShowError('Select all fields')
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setPrice}
                value={price ? price : ''}
                placeholder="Price"
            />
            <TextInput
                style={styles.descriptionInput}
                onChangeText={setExpenseDetails}
                value={expenseDetails ? expenseDetails : ''}
                placeholder="Description(optional)"
            />
            <View style={styles.optionsView}>
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#000"
                    // style={purchaseType === "Groceries" ? styles.iconActive : {}}
                    onPress={() => {
                        setPurchaseType("Groceries");
                        // changePurchaseType("Groceries");
                    }}
                >
                    <Image
                        source={groceries}
                        style={
                            purchaseType === "Groceries"
                                ? { ...styles.iconActive, ...styles.stretch }
                                : styles.stretch
                        }
                    />
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#000"
                    style={purchaseType === "Utilities" ? styles.iconActive : {}}
                    onPress={() => {
                        setPurchaseType("Utilities");
                    }}
                >
                    <Image source={shopping} style={styles.stretch} />
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#000"
                    style={purchaseType === "Gas" ? styles.iconActive : {}}
                    onPress={() => {
                        setPurchaseType("Gas");
                    }}
                >
                    <Image source={gas} style={styles.stretch} />
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#000"
                    style={purchaseType === "Social" ? styles.iconActive : {}}
                    onPress={() => {
                        setPurchaseType("Social");
                    }}
                >
                    <Image source={social} style={styles.stretch} />
                </TouchableHighlight>
            </View>
            <Text style={styles.purchaseType}>{purchaseType}</Text>
            <Text style={{ fontSize: 40 }}>{price && price > 0 ? 'Rs.' + price + '/-' : ''}</Text>
      <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
        <Button style={styles.submitButton}
          onPress={(event) => { handleSubmit(event) }}
          title="add Expense" />
          <View style={{padding:10}}></View>
        <Button style={styles.button}
          onPress={() => { navigation.push('Dashboard') }}
          title="go to Dashboard" />
      </View>
      {showError ?
        <Text>{showError}</Text>
        : null
      }
        </View>
    )
}

export default AddPayments;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d0e3f1",
        alignItems: "center",
        justifyContent: "center",
    },
    optionsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 50
    },
    input: {
        height: 50,
        minWidth: 150,
        margin: 12,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#2d47ff",
        padding: 10,
        fontSize: 30
    },
    descriptionInput: {
        height: 40,
        minWidth: 150,
        margin: 12,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#2d47ff",
        padding: 10,
        fontSize: 20
    },
    stretch: {
        width: 50,
        height: 50,
        resizeMode: "stretch",
        marginHorizontal: 10
    },
    iconActive: {
        backgroundColor: "#3a52ff9c",
        // borderColor: 'blue'
        borderRadius: 5,
        borderColor: "#2d47ff",
    },
    purchaseType: {
        fontSize: 30,
        marginTop: 10,
        color: "#000"
    },
    button: {
        marginBottom: 20
    },
    submitButton: {
        marginEnd: 10,
    }
});