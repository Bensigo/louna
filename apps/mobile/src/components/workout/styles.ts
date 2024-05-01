import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    width: 250,
    height: 150,
    paddingVertical: 10,
    paddingHorizontal: 10, 
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden', // Ensure that the text doesn't overflow the card
    justifyContent: 'flex-end', // Center the text vertically
    alignItems: 'flex-start', // Center the text horizontally
  },
  cardText: {
    color: 'white', // Text color
    fontSize: 18,
    fontWeight: '900',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },

});
