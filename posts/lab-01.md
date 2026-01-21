In this section we create a game called "Roll a Ball" based on the official Unity tutorial "https://learn.unity.com/project/roll-a-ball".

![Game Environment](/rollaball/1.png "Game Environment")

The theme is "Telecom Paris master student." As the player, we control a ball and collect 12 courses, each worth 5 ECTS. After collecting a course, an hourglass appears near the ball and follows the player. Each hourglass lasts for 60 seconds. In total, the player has 365 seconds to collect all courses. There is also a health bar in the canteen that gives the player one extra chance to get hit by deadlines.

![Gameplay](rollaball/gameplay.gif "Gameplay")

Below are the implemented features.

## 1. Ball Design

The ball is an .stl model converted to .fbx in Blender. It has a light inside that increases in intensity as the ECTS value increases.

![Ball light comparison](rollaball/2.png "Ball light comparison")

## 2. Environment Design

While the main design is implemented manually, most objects are free assets from the Unity Asset Store.

## 3. Ball Movement

The ball movement in this project is more advanced than in the tutorial. We can freely move the camera, we defined acceleration for smoother movement, and we added a jump mechanic. The code for this part is below.

```csharp
private void FixedUpdate()
{
    Vector3 movementDirection = Vector3.zero;

    if (cameraTransform != null)
    {
        Vector3 camForward = cameraTransform.forward;
        Vector3 camRight = cameraTransform.right;

        camForward.y = 0;
        camRight.y = 0;
        camForward.Normalize();
        camRight.Normalize();

        movementDirection = (camForward * movementY + camRight * movementX).normalized;
    }
    else
    {
        movementDirection = new Vector3(movementX, 0.0f, movementY);
    }

    rb.AddForce(movementDirection * acceleration, ForceMode.Acceleration);

    Vector3 horizontalVelocity = new Vector3(rb.linearVelocity.x, 0f, rb.linearVelocity.z);
    if (horizontalVelocity.magnitude > maxSpeed)
    {
        Vector3 limited = horizontalVelocity.normalized * maxSpeed;
        rb.linearVelocity = new Vector3(limited.x, rb.linearVelocity.y, limited.z);
    }
}

void OnJump(InputValue movementValue)
{
    // Specific check for ball shape.
    if (Physics.Raycast(transform.position, Vector3.down, GetComponent<Collider>().bounds.extents.y + 0.1f))
    {
        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
    }
}
```

## 4. Player Health Bar

The player health bar is a simple "hearts" UI on a Canvas. The player only has one health in the list at the start of the game. The health value is stored on the player in PlayerController as playerHealth. It is initialized in Start() and pushed to the UI via healthUI.SetHealth(playerHealth). When the player takes damage by colliding with an object tagged "Deadline," it decrements playerHealth, updates the hearts, and destroys that deadline object. When the player heals by entering a trigger tagged "Cantine," it increments playerHealth, updates the hearts, and destroys the pickup. The UI always shows the current integer health value.

![Player Healthbar](rollaball/5.png "Player Healthbar")

## 5. AI Movement

The hourglass movement follows the tutorial. We define a NavMesh for the environment and assign the hourglasses as NavMesh agents to follow the player. Then we define collision with the player so that, on contact, the player loses a heart. We do this by defining a tag called "Deadline" and assigning it to the hourglasses:

```csharp
if (collision.gameObject.CompareTag("Deadline"))
{
    if (playerHealth <= 0)
    {
        LoseGame();
    }
    else
    {
        playerHealth -= 1;
        healthUI.SetHealth(playerHealth);

        Destroy(collision.gameObject);
    }
}
```

![Nav Mesh](rollaball/6.png "Nav Mesh")


## 6. Deadlines Appearance and Perish

![Enemy Spawn](rollaball/3.png "Enemy Spawn")

When we collect a collectible (ECTS), we call ActivateEnemy() to activate or enable the hourglass. It already has a predefined location, so spawning only requires activating visibility.

```csharp
private void OnTriggerEnter(Collider other)
{
    if (other.CompareTag("Player"))
    {
        PlayerController player = other.GetComponentInParent<PlayerController>();
        if (player != null)
        {
            player.AddEcts(5);
        }

        ActivateEnemy();
    }
}

void ActivateEnemy()
{
    if (linkedEnemy != null)
    {
        if (linkedEnemy.transform.IsChildOf(transform))
        {
            linkedEnemy.transform.SetParent(null, true);
        }

        linkedEnemy.SetActive(true);
    }

    Destroy(gameObject);
}
```

For despawning, we define a 60-second lifetime after which they are destroyed.

```csharp
private IEnumerator DespawnAfterLifetime()
{
    yield return new WaitForSeconds(lifetimeSeconds);

    if (despawnParticles != null)
    {
        despawnParticles.transform.SetParent(null, true);
        despawnParticles.Play();
        Destroy(despawnParticles.gameObject, despawnDelay);
    }

    Destroy(gameObject);
}
```

## 7. Win Mechanism

When the player triggers an ECTS collectible, it calls player.AddEcts(5) on PlayerController, which increments the private ECTS counter and updates the UI text. In PlayerController.cs, AddEcts checks if (ECTS >= 60) and, once that threshold is reached, it shows the graduation UI, pauses gameplay by setting Time.timeScale = 0f, and destroys a Deadline object via Destroy(GameObject.FindGameObjectWithTag("Deadline")).

![Enemy Spawn](rollaball/4.png "Enemy Spawn")
