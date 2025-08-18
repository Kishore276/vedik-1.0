import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchEventById, registerForEvent } from '../services/eventService';
import { Event } from '../types/Event';
import { toast } from 'sonner-native';

export default function EventDetailsScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchEventById(eventId);
      if (data) {
        setEvent(data);
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!event) return;
    
    try {
      setRegistering(true);
      const success = await registerForEvent(event.id, 'current-user-id');
      
      if (success) {
        setRegistered(true);
        toast.success('Successfully registered for the event!');
        setEvent({
          ...event,
          attendees: event.attendees + 1
        });
      } else {
        toast.error('Failed to register. Event may be full.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;
    
    try {
      await Share.share({
        title: event.title,
        message: `Check out this event: ${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.location}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E60CE" />
      </View>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4d4f" />
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate(`Main`)}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent(event.title)}&aspect=16:9&seed=${event.id}` }}
            style={styles.image}
          />
          <TouchableOpacity 
            style={styles.backIconButton} 
            onPress={() => navigation.navigate(`Main`)}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.shareIconButton} 
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateMonth}>{eventDate.toLocaleString('default', { month: 'short' })}</Text>
              <Text style={styles.dateDay}>{eventDate.getDate()}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{event.title}</Text>
              <View style={[styles.badge, { backgroundColor: event.category === 'Music' ? '#5E60CE' : 
                                          event.category === 'Sports' ? '#76c893' : 
                                          event.category === 'Business' ? '#f77f00' : '#4cc9f0' }]}>
                <Text style={styles.badgeText}>{event.category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                {eventDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                {eventDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{event.organizer}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendance</Text>
            <View style={styles.attendanceRow}>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${(event.attendees / event.maxAttendees) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.attendanceText}>
                {event.attendees} / {event.maxAttendees} attendees
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price</Text>
            <Text style={styles.priceText}>
              {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isPastEvent ? (
          <View style={styles.pastEventButton}>
            <Text style={styles.pastEventText}>This event has ended</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[
              styles.registerButton, 
              registered && styles.registeredButton
            ]} 
            onPress={handleRegister}
            disabled={registering || registered || event.attendees >= event.maxAttendees}
          >
            {registering ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.registerButtonText}>
                {registered ? 'Registered' : 
                 event.attendees >= event.maxAttendees ? 'Sold Out' : 
                 'Register Now'}
              </Text>
            )}
          </TouchableOpacity>
        )}
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backIconButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIconButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateBox: {
    width: 60,
    height: 60,
    backgroundColor: '#5E60CE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateMonth: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateDay: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  infoRow: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e1e1e1',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5E60CE',
    borderRadius: 4,
  },
  attendanceText: {
    fontSize: 14,
    color: '#666',
    minWidth: 120,
    textAlign: 'right',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5E60CE',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  registerButton: {
    backgroundColor: '#5E60CE',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registeredButton: {
    backgroundColor: '#43aa8b',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pastEventButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastEventText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
});