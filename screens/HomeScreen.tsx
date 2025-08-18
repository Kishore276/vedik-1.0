import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchEvents, fetchUpcomingReminders } from '../services/eventService';
import { Event } from '../types/Event';
import { Reminder } from '../types/Reminder';
import EventCard from '../components/EventCard';
import ReminderCard from '../components/ReminderCard';
import PackageCard from '../components/PackageCard';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const packages = [
    {
      id: 1,
      name: 'Basic Reminder',
      description: 'Get reminders for special dates',
      price: 0,
      features: ['Date reminders', 'Basic notifications'],
      color: ['#4cc9f0', '#4361ee']
    },
    {
      id: 2,
      name: 'Surprise Party',
      description: 'Complete surprise party planning',
      price: 99,
      features: ['Date reminders', 'Vendor connections', 'Gift suggestions', 'Invitation management'],
      color: ['#7209b7', '#3a0ca3']
    },
    {
      id: 3,
      name: 'Premium Events',
      description: 'Full-service event planning',
      price: 299,
      features: ['Everything in Surprise Party', 'Venue booking', 'Catering', 'Entertainment', 'VIP services'],
      color: ['#f72585', '#b5179e']
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, remindersData] = await Promise.all([
        fetchEvents(),
        fetchUpcomingReminders()
      ]);
      
      setUpcomingEvents(eventsData.filter(e => new Date(e.date) > new Date()));
      setReminders(remindersData);
    } catch (error) {
      console.error('Failed to load home data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterEventsByType = (type: string) => {
    if (type === 'all') return upcomingEvents;
    return upcomingEvents.filter(event => {
      if (type === 'surprise' && event.isPrivate) return true;
      if (type === 'large' && event.maxAttendees > 50) return true;
      return false;
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.headerTitle}>Party Planner Pro</Text>
      </View>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRemindersSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {reminders.length === 0 ? (
        <TouchableOpacity 
          style={styles.noReminderCard}
          onPress={() => navigation.navigate('CreateReminder')}
        >
          <Ionicons name="notifications-outline" size={28} color="#5E60CE" />
          <Text style={styles.noReminderText}>No upcoming reminders</Text>
          <Text style={styles.noReminderSubtext}>Tap to add important dates</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.remindersContainer}
        >
          {reminders.map((reminder) => (
            <ReminderCard 
              key={reminder.id} 
              reminder={reminder} 
              onPress={() => navigation.navigate('ReminderDetails', { reminderId: reminder.id })}
            />
          ))}
          <TouchableOpacity 
            style={styles.addReminderCard}
            onPress={() => navigation.navigate('CreateReminder')}
          >
            <View style={styles.addIcon}>
              <Ionicons name="add" size={28} color="#fff" />
            </View>
            <Text style={styles.addReminderText}>Add New Reminder</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );

  const renderPackagesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Packages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Packages')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packagesContainer}
      >
        {packages.map((pkg) => (
          <PackageCard 
            key={pkg.id} 
            package={pkg} 
            onPress={() => navigation.navigate('PackageDetails', { packageId: pkg.id })}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderEventsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'surprise' && styles.activeTab]}
          onPress={() => setActiveTab('surprise')}
        >
          <Text style={[styles.tabText, activeTab === 'surprise' && styles.activeTabText]}>
            Surprise Parties
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'large' && styles.activeTab]}
          onPress={() => setActiveTab('large')}
        >
          <Text style={[styles.tabText, activeTab === 'large' && styles.activeTabText]}>
            Large Events
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filterEventsByType(activeTab)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard 
            event={item} 
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        }
      />
    </View>
  );

  const renderQuickActionsSection = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('CreateReminder')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#4cc9f0' }]}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Add Reminder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#7209b7' }]}>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Plan Event</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('VendorSearch')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#f72585' }]}>
            <Ionicons name="people-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Find Vendors</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Ideas')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#f77f00' }]}>
            <Ionicons name="bulb-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Party Ideas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E60CE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Promotional Banner */}
        <TouchableOpacity style={styles.bannerContainer} onPress={() => navigation.navigate('Packages')}>
          <Image 
            source={{ uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent('Premium Party Planning Services')}&aspect=16:9&seed=banner` }} 
            style={styles.bannerImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.bannerGradient}
          >
            <Text style={styles.bannerTitle}>50% Off First Event</Text>
            <Text style={styles.bannerSubtitle}>Limited time offer for new customers</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {renderRemindersSection()}
        {renderQuickActionsSection()}
        {renderPackagesSection()}
        {renderEventsSection()}
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => navigation.navigate('Support')}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#5E60CE" />
            <Text style={styles.supportButtonText}>Need help planning your event?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E60CE',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'white',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#5E60CE',
    fontWeight: '500',
  },
  remindersContainer: {
    paddingHorizontal: 12,
  },
  noReminderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noReminderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  noReminderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addReminderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 150,
  },
  addIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5E60CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addReminderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  packagesContainer: {
    paddingHorizontal: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
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
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  quickActionsSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportButtonText: {
    marginLeft: 8,
    color: '#5E60CE',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5E60CE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});