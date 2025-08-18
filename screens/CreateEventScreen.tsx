import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createEvent } from '../services/eventService';
import { Event } from '../types/Event';
import { toast } from 'sonner-native';

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  organizer?: string;
  price?: string;
  category?: string;
  maxAttendees?: string;
}

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const categories = ['Music', 'Business', 'Sports', 'Health', 'Education', 'Technology', 'Arts', 'Other'];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    if (!organizer.trim()) {
      newErrors.organizer = 'Organizer is required';
      isValid = false;
    }

    if (!category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }

    if (!maxAttendees) {
      newErrors.maxAttendees = 'Maximum attendees is required';
      isValid = false;
    } else if (isNaN(Number(maxAttendees)) || Number(maxAttendees) <= 0) {
      newErrors.maxAttendees = 'Maximum attendees must be a positive number';
      isValid = false;
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Price must be a non-negative number';
      isValid = false;
    }

    if (date.getTime() < new Date().getTime()) {
      newErrors.date = 'Event date cannot be in the past';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      
      const eventData: Omit<Event, 'id'> = {
        title,
        description,
        date: date.toISOString(),
        location,
        imageUrl: '',
        organizer,
        price: Number(price),
        category,
        attendees: 0,
        maxAttendees: Number(maxAttendees),
        isVirtual
      };

      const newEvent = await createEvent(eventData);
      
      toast.success('Event created successfully!');
      navigation.navigate('EventDetails', { eventId: newEvent.id });
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentTime = date;
      selectedDate.setHours(currentTime.getHours());
      selectedDate.setMinutes(currentTime.getMinutes());
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
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
              onPress={() => navigation.navigate(`Main`)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Event</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Event Title *</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter the event title"
                  placeholderTextColor="#999"
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.textarea, errors.description && styles.inputError]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your event"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Date and Time *</Text>
                <View style={styles.dateTimeContainer}>
                  <TouchableOpacity 
                    style={[styles.dateTimeButton, errors.date && styles.inputError]} 
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                    <Text style={styles.dateTimeText}>
                      {date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.dateTimeButton} 
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.dateTimeText}>
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
                
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                
                {showTimePicker && (
                  <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Location *</Text>
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Event location"
                  placeholderTextColor="#999"
                />
                {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Is this a virtual event?</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[styles.toggleButton, isVirtual ? styles.toggleActive : {}]}
                    onPress={() => setIsVirtual(true)}
                  >
                    <Text style={[styles.toggleText, isVirtual ? styles.toggleActiveText : {}]}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleButton, !isVirtual ? styles.toggleActive : {}]}
                    onPress={() => setIsVirtual(false)}
                  >
                    <Text style={[styles.toggleText, !isVirtual ? styles.toggleActiveText : {}]}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Organizer *</Text>
                <TextInput
                  style={[styles.input, errors.organizer && styles.inputError]}
                  value={organizer}
                  onChangeText={setOrganizer}
                  placeholder="Who is organizing this event?"
                  placeholderTextColor="#999"
                />
                {errors.organizer && <Text style={styles.errorText}>{errors.organizer}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        category === cat && styles.categoryButtonActive
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          category === cat && styles.categoryTextActive
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Maximum Attendees *</Text>
                <TextInput
                  style={[styles.input, errors.maxAttendees && styles.inputError]}
                  value={maxAttendees}
                  onChangeText={setMaxAttendees}
                  placeholder="How many people can attend?"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
                {errors.maxAttendees && <Text style={styles.errorText}>{errors.maxAttendees}</Text>}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateEvent}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.createButtonText}>Create Event</Text>
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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '48%',
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#5E60CE',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  toggleActiveText: {
    color: 'white',
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f2f2f2',
  },
  categoryButtonActive: {
    backgroundColor: '#5E60CE',
  },
  categoryText: {
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
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