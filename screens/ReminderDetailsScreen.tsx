import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchReminderById, fetchEventById, deleteReminder } from '../services/eventService';
import { Reminder } from '../types/Reminder';
import { Event } from '../types/Event';
import { toast } from 'sonner-native';

export default function ReminderDetailsScreen({ route, navigation }: any) {
  const { reminderId } = route.params;
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [plannedEvent, setPlannedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReminderDetails();
  }, [reminderId]);

  const loadReminderDetails = async () => {
    try {
      setLoading(true);
      const reminderData = await fetchReminderById(reminderId);
      
      if (reminderData) {
        setReminder(reminderData);
        
        if (reminderData.plannedEventId) {
          const eventData = await fetchEventById(reminderData.plannedEventId);
          if (eventData) {
            setPlannedEvent(eventData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch reminder details:', error);
      toast.error('Failed to load reminder details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      const success = await deleteReminder(reminderId);
      
      if (success) {
        toast.success('Reminder deleted successfully');
        navigation.navigate('Home');
      } else {
        toast.error('Failed to delete reminder');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateEvent = () => {
    if (!reminder) return;
    
    navigation.navigate('CreateEvent', {
      prefilledData: {
        title: `${reminder.type === 'birthday' ? 'Birthday' : 'Anniversary'} Event for ${reminder.recipientName}`,
        date: reminder.date,
        isPrivate: true,
        reminderId: reminder.id
      }
    });
  };

  const daysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getIconName = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'gift-outline';
      case 'anniversary':
        return 'heart-outline';
      case 'meeting':
        return 'calendar-outline';
      default:
        return 'calendar-outline';
    }
  };

  const getCardColors = (type: string) => {
    switch (type) {
      case 'birthday':
        return ['#4cc9f0', '#4361ee'];
      case 'anniversary':
        return ['#f72585', '#b5179e'];
      case 'meeting':
        return ['#3a5a40', '#52b788'];
      default:
        return ['#5E60CE', '#4CC9F0'];
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E60CE" />
      </View>
    );
  }

  if (!reminder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4d4f" />
          <Text style={styles.errorText}>Reminder not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const colors = getCardColors(reminder.type);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={colors}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backIconButton} 
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.reminderIconContainer}>
              <Ionicons name={getIconName(reminder.type)} size={40} color="white" />
            </View>
            
            <Text style={styles.reminderType}>
              {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
            </Text>
            
            <Text style={styles.title}>{reminder.title}</Text>
            
            <Text style={styles.dateText}>
              {new Date(reminder.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownText}>{daysUntil(reminder.date)} days left</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {reminder.recipientName && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Person</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{reminder.recipientName}</Text>
              </View>
              
              {reminder.relationship && (
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{reminder.relationship}</Text>
                </View>
              )}
            </View>
          )}

          {reminder.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{reminder.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {reminder.notifyBefore.map((days) => (
              <View key={days} style={styles.notificationItem}>
                <Ionicons name="notifications-outline" size={20} color="#666" />
                <Text style={styles.notificationText}>
                  {days === 1 ? '1 day before' : 
                   days === 7 ? '1 week before' : 
                   days === 14 ? '2 weeks before' : 
                   days === 30 ? '1 month before' : `${days} days before`}
                </Text>
              </View>
            ))}
          </View>

          {(reminder.type === 'birthday' || reminder.type === 'anniversary') && reminder.giftIdeas && reminder.giftIdeas.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gift Ideas</Text>
              {reminder.giftIdeas.map((gift, index) => (
                <View key={index} style={styles.giftItem}>
                  <Ionicons name="gift-outline" size={20} color="#666" />
                  <Text style={styles.giftText}>{gift}</Text>
                </View>
              ))}
            </View>
          )}

          {plannedEvent ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Planned Event</Text>
              <TouchableOpacity 
                style={styles.eventCard}
                onPress={() => navigation.navigate('EventDetails', { eventId: plannedEvent.id })}
              >
                <View style={styles.eventIconContainer}>
                  <Ionicons name="calendar" size={24} color="#5E60CE" />
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{plannedEvent.title}</Text>
                  <Text style={styles.eventDate}>
                    {new Date(plannedEvent.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                  <Text style={styles.eventLocation}>{plannedEvent.location}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          ) : reminder.plannedSurprise ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Surprise Event</Text>
              <TouchableOpacity 
                style={styles.createEventButton}
                onPress={handleCreateEvent}
              >
                <Ionicons name="add-circle-outline" size={20} color="#5E60CE" />
                <Text style={styles.createEventText}>Plan a Surprise Event</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditReminder', { reminderId: reminder.id })}
        >
          <Text style={styles.editButtonText}>Edit Reminder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#5E60CE',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backIconButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  reminderType: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 16,
  },
  countdownBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  countdownText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -20,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  giftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  giftText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  eventIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0ff',
    borderWidth: 1,
    borderColor: '#e0e0ff',
    borderRadius: 8,
    paddingVertical: 12,
  },
  createEventText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5E60CE',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#5E60CE',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 100,
    backgroundColor: '#ff4d4f',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});