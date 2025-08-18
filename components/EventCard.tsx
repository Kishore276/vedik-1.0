import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types/Event';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard = ({ event, onPress }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventTypeIcon = () => {
    if (event.isPrivate) {
      return { name: 'gift-outline', color: '#f72585' };
    } else if (event.maxAttendees > 50) {
      return { name: 'people-outline', color: '#4361ee' };
    } else {
      return { name: 'calendar-outline', color: '#4cc9f0' };
    }
  };

  const icon = getEventTypeIcon();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent(event.title)}&aspect=16:9&seed=${event.id}` }} 
        style={styles.image} 
      />
      
      {event.isPrivate && (
        <View style={styles.surpriseBadge}>
          <Ionicons name="sparkles" size={14} color="white" />
          <Text style={styles.surpriseText}>Surprise</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
            <Ionicons name={icon.name} size={18} color="white" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
            <View style={[styles.badge, { backgroundColor: event.category === 'Music' ? '#5E60CE' : 
                                        event.category === 'Sports' ? '#76c893' : 
                                        event.category === 'Business' ? '#f77f00' : 
                                        event.category === 'Birthday' ? '#f72585' :
                                        event.category === 'Anniversary' ? '#b5179e' : '#4cc9f0' }]}>
              <Text style={styles.badgeText}>{event.category}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.date}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          {' '}{formatDate(event.date)}
        </Text>
        <Text style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#666" />
          {' '}{event.location}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.attendeeCount}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.attendeeText}>{event.attendees} attending</Text>
          </View>
          
          <Text style={styles.priceText}>
            {event.price === 0 ? 'Free' : `$${event.price.toFixed(0)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#eee',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  attendeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '500',
  },
  surpriseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f72585',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  surpriseText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  priceText: {
    fontWeight: 'bold',
    color: '#5E60CE',
  },
});

export default EventCard;