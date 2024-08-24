import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { api } from "~/utils/api";
import { ActivityIndicator, Alert, Switch } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { colorScheme } from "~/constants/colors";

const ChallengeSettings = ({ id }) => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      isFreeSession: false,
      start: new Date(),
      end: new Date(),
    },
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const utils = api.useUtils();
  const { mutate: updateChallenge, isLoading: isUpdating  } = api.challenges.update.useMutation();
  const { data: challenge, isLoading } = api.challenges.get.useQuery({ id });
  const { mutate: deleteChallenge , isLoading: isDeleting} = api.challenges.delete.useMutation();

  useEffect(() => {
    if (challenge) {
      setValue("title", challenge.title || "");
      setValue("description", challenge.description || "");
      setValue("isFreeSession", challenge.isFreeSession || false);
      setValue("start", new Date(challenge.start) ?? new Date());
      setValue("end", new Date(challenge.end) ?? new Date(challenge.start as Date));
    }
  }, [challenge, setValue]);

  const handleDateChange = (date, type) => {
    setValue(type, date);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleDeleteChallenge = () => {
    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteChallenge({ id }, {
              onError(err) {
                Alert.alert('Error', err?.message || "An error occurred");
              },
              onSuccess() {
                utils.challenges.get.invalidate();
                router.push('/(tabs)/challenges/(tabs)/created');
              }
            });
          }
        },
      ]
    );
  };

  const onSubmit = (data) => {
    updateChallenge({
      id,
      ...data,
    }, {
      onError(err) {
        Alert.alert('Error', err?.message || "An error occurred");
      },
      async onSuccess() {
        await utils.challenges.get.invalidate();
       
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter challenge title"
            />
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              onChangeText={onChange}
              value={value}
              placeholder="Enter challenge description"
              multiline
              numberOfLines={4}
            />
          )}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Private Challenge</Text>
        <Controller
          control={control}
          name="isFreeSession"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
            />
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {watch("start").toLocaleDateString()}
          </Text>
          <Ionicons name="calendar-outline" size={24} color={colorScheme.primary.lightGreen}  />
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={watch("start")}
            mode="datetime"
            display="spinner"
            onChange={(event, selectedDate) => handleDateChange(selectedDate, "start")}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {watch("end").toLocaleDateString()}
          </Text>
          <Ionicons name="calendar-outline" size={24} color={colorScheme.primary.lightGreen} />
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={watch("end")}
             mode="datetime"
            display="spinner"
            onChange={(event, selectedDate) => handleDateChange(selectedDate, "end")}
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
        {isUpdating? <ActivityIndicator size={'small'} /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteChallenge}>
       {isDeleting ? <ActivityIndicator  size={'small'} /> : <Text style={styles.deleteButtonText}>Delete Challenge</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3A3D8',
    padding: 20,
    paddingTop: 80
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: colorScheme.primary.green,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colorScheme.accent.red,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChallengeSettings;