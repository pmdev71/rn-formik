import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
} from 'react-native';
import {Formik, Field} from 'formik';
import * as yup from 'yup';
import CustomInput from '../components/common/components/CustomInput';

//API client
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../reduxtoolkit/UserSlice';

const signUpValidationSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/(\w.+\s).+/, 'Enter at least 2 names')
    .required('Full name is required'),
  // phoneNumber: yup
  //   .string()
  //   .matches(/(01)(\d){8}\b/, 'Enter a valid phone number')
  //   .required('Phone number is required'),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email is required'),
  password: yup
    .string()
    // .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    // .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    // .matches(/\d/, 'Password must have a number')
    // .matches(
    //   /[!@#$%^&*()\-_"=+{}; :,<.>]/,
    //   'Password must have a special character',
    // )
    .min(6, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref('password')], 'Passwords do not match')
  //   .required('Confirm password is required'),
});

const SignUp = ({navigation}) => {
  const dispatch = useDispatch();

  const handleSignUp = credentials => {
    const url = 'https://xdrabbit-server.vercel.app/user/signup';

    axios
      .post(url, credentials)
      .then(response => {
        const result = response.data;
        const {msg, status, data} = result;
        console.log('Result signup--->', result);
        if (status === 'Success') {
          storeDataAsyncStorage(data);
          navigation.navigate('Welcome', {user: data});
        } else if (status === 'Pending') {
          console.log('Email Verification--->', msg);
          navigation.navigate('EmailVerification');
        } else {
          console.log('Error--->', msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  //store logged in user data in async storage
  const storeDataAsyncStorage = async data => {
    try {
      const dataInjsonValue = JSON.stringify(data);
      //add user data to redux store
      dispatch(setUser(data));
      //add user data to async storage
      await AsyncStorage.setItem('pmAsyncStoreData', dataInjsonValue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.signupContainer}>
          <Text>Sign Up Screen</Text>
          <Formik
            validationSchema={signUpValidationSchema}
            initialValues={{
              name: '',
              email: '',
              // phoneNumber: '',
              password: '',
              // confirmPassword: '',
            }}
            onSubmit={values => {
              handleSignUp(values);
              // console.log(values)
            }}>
            {({handleSubmit, isValid}) => (
              <>
                <Field
                  component={CustomInput}
                  name="name"
                  placeholder="Full Name"
                />
                <Field
                  component={CustomInput}
                  name="email"
                  placeholder="Email Address"
                  keyboardType="email-address"
                />
                {/* <Field
                  component={CustomInput}
                  name="phoneNumber"
                  placeholder="Phone Number"
                  keyboardType="numeric"
                /> */}
                <Field
                  component={CustomInput}
                  name="password"
                  placeholder="Password"
                  secureTextEntry
                />
                {/* <Field
                  component={CustomInput}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  secureTextEntry
                /> */}

                <Button
                  onPress={handleSubmit}
                  title="SIGN UP"
                  disabled={!isValid}
                />
                <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
                  <Text>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
    backgroundColor: '#e6e6e6',
  },
});
export default SignUp;
