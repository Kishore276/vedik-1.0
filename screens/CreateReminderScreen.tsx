import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createReminder } from '../services/eventService';
import { Reminder } from '../types/Reminder';
import { toast } from 'sonner-native';

interface FormErrors {
  title?: string;
  date?: string;
  type?: string;
  recipientName?: string;
}

export default function CreateReminderScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<'birthday' | 'anniversary' | 'meeting' | 'other'>('birthday');
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notifyBefore, setNotifyBefore] = useState([1, 7]);
  const [giftIdeas, setGiftIdeas] = useState('');
  const [plannedSurprise, setPlannedSurprise] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const reminderTypes = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'other', label: 'Other' }
  ];

  const notificationOptions = [
    { value: 1, label: '1 day before' },
    { value: 7, label: '1 week before' },
    { value: 14, label: '2 weeks before' },
    { value: 30, label: '1 month before' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!type) {
      newErrors.type = 'Type is required';
      isValid = false;
    }

    if (date.getTime() < new Date().getTime()) {
      newErrors.date = 'Date cannot be in the past';
      isValid = false;
    }

    if (type !== 'meeting' && !recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateReminder = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      
      const reminderData: Omit<Reminder, 'id'> = {
        title,
        date: date.toISOString(),
        type,
        description,
        recipientName,
        relationship,
        notifyBefore,
        giftIdeas: giftIdeas.split(',').map(idea => idea.trim()),
        plannedSurprise
      };

      const newReminder = await createReminder(reminderData);
      
      toast.success('Reminder created successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to create reminder:', error);
      toast.error('Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const toggleNotification = (value: number) => {
    if (notifyBefore.includes(value)) {
      setNotifyBefore(notifyBefore.filter(v => v !== value));
    } else {
      setNotifyBefore([...notifyBefore, value]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Reminder</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Reminder Title *</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter a title for this reminder"
                  placeholderTextColor="#999"
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Type *</Text>
                <View style={styles.typeContainer}>
                  {reminderTypes.map((reminderType) => (
                    <TouchableOpacity
                      key={reminderType.value}
                      style={[
                        styles.typeButton,
                        type === reminderType.value && styles.typeButtonActive
                      ]}
                      onPress={() => setType(reminderType.value as any)}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          type === reminderType.value && styles.typeTextActive
                        ]}
                      >
                        {reminderType.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity 
                  style={[styles.dateButton, errors.date && styles.inputError]} 
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text style={styles.dateText}>
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </TouchableOpacity>
                {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
                
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              {(type === 'birthday' || type === 'anniversary') && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Person's Name *</Text>
                    <TextInput
                      style={[styles.input, errors.recipientName && styles.inputError]}
                      value={recipientName}
                      onChangeText={setRecipientName}
                      placeholder={
                        type === 'birthday' 
                          ? 'Whose birthday is it?' 
                          : 'Whose anniversary is it?'
                      }
                      placeholderTextColor="#999"
                    />
                    {errors.recipientName && <Text style={styles.errorText}>{errors.recipientName}</Text>}
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Relationship</Text>
                    <TextInput
                      style={styles.input}
                      value={relationship}
                      onChangeText={setRelationship}
                      placeholder="Friend, Family member, Colleague, etc."
                      placeholderTextColor="#999"
                    />
                  </View>
                </>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.textarea}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add notes about this reminder"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Notify Me</Text>
                {notificationOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.notificationOption}
                    onPress={() => toggleNotification(option.value)}
                  >
                    <View style={styles.checkbox}>
                      {notifyBefore.includes(option.value) && (
                        <Ionicons name="checkmark" size={16} color="#5E60CE" />
                      )}
                    </View>
                    <Text style={styles.notificationText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(type === 'birthday' || type === 'anniversary') && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Gift Ideas</Text>
                    <TextInput
                      style={styles.textarea}
                      value={giftIdeas}
                      onChangeText={setGiftIdeas}
                      placeholder="Enter gift ideas separated by commas"
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <View style={styles.switchRow}>
                      <View>
                        <Text style={styles.label}>Plan a Surprise</Text>
                        <Text style={styles.switchDescription}>
                          We'll help you organize a surprise event
                        </Text>
                      </View>
                      <Switch
                        value={plannedSurprise}
                        onValueChange={setPlannedSurprise}
                        trackColor={{ false: '#e1e1e1', true: '#bdc0ff' }}
                        thumbColor={plannedSurprise ? '#5E60CE' : '#f4f3f4'}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateReminder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.createButtonText}>Create Reminder</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  textarea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f2f2f2',
  },
  typeButtonActive: {
    backgroundColor: '#5E60CE',
  },
  typeText: {
    color: '#666',
    fontWeight: '500',
  },
  typeTextActive: {
    color: 'white',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  createButton: {
    backgroundColor: '#5E60CE',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});