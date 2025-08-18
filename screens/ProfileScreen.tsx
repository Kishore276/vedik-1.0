import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchEvents } from '../services/eventService';
import { Event } from '../types/Event';
import EventCard from '../components/EventCard';

export default function ProfileScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registered'); // 'registered', 'organized'
  
  // Mock user data - in a real app, this would come from a user service or auth provider
  const user = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    bio: 'Event enthusiast and organizer. Love bringing people together.',
    avatar: 'https://api.a0.dev/assets/image?text=Alex%20Johnson&aspect=1:1',
    totalEventsAttended: 12,
    totalEventsOrganized: 3
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
      
      // In a real app, these would come from user-specific API calls
      // For demo purposes, we'll filter mock data
      setUserEvents(data.filter(event => event.organizer === 'EventHub Productions'));
      setRegisteredEvents(data.filter(event => event.id % 2 === 0)); // Just a mock filter
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEventsList = () => {
    const displayEvents = activeTab === 'registered' ? registeredEvents : userEvents;
    
    if (loading) {
      return <ActivityIndicator size="large" color="#5E60CE" style={styles.loader} />;
    }
    
    if (displayEvents.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={activeTab === 'registered' ? 'calendar-outline' : 'create-outline'} 
            size={64} 
            color="#ccc" 
          />
          <Text style={styles.emptyText}>
            {activeTab === 'registered' 
              ? 'You have not registered for any events yet' 
              : 'You have not organized any events yet'}
          </Text>
          {activeTab === 'organized' && (
            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Text style={styles.createEventButtonText}>Create an Event</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    
    return (
      <FlatList
        data={displayEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard 
            event={item} 
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsList}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.totalEventsAttended}</Text>
              <Text style={styles.statLabel}>Events Attended</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.totalEventsOrganized}</Text>
              <Text style={styles.statLabel}>Events Organized</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'registered' && styles.activeTab]}
            onPress={() => setActiveTab('registered')}
          >
            <Text style={[styles.tabText, activeTab === 'registered' && styles.activeTabText]}>
              Registered Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'organized' && styles.activeTab]}
            onPress={() => setActiveTab('organized')}
          >
            <Text style={[styles.tabText, activeTab === 'organized' && styles.activeTabText]}>
              Your Events
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsContainer}>
          {renderEventsList()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E60CE',
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5E60CE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e1e1e1',
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#5E60CE',
    borderRadius: 8,
  },
  editProfileText: {
    color: '#5E60CE',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#5E60CE',
  },
  tabText: {
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  eventsList: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  createEventButton: {
    backgroundColor: '#5E60CE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createEventButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});